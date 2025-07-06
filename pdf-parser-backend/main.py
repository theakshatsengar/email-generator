from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
import io
import os
from groq import Groq
from pydantic import BaseModel
from typing import Optional
import json
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="PDF Parser Microservice", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class ParsedResume(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    company: Optional[str] = None
    position: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    website: Optional[str] = None
    linkedin: Optional[str] = None

def extract_text_from_pdf(pdf_file: bytes) -> str:
    """Extract text from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_file))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse PDF: {str(e)}")

def extract_resume_data_with_groq(text: str) -> ParsedResume:
    """Use Groq LLM to extract structured data from resume text"""
    
    system_prompt = """You are a resume parser. Extract the following information from the resume text and return it as a JSON object. If any field is not found, set it to null.

Required fields:
- name: Full name of the person
- email: Email address
- phone: Phone number
- location: City, State/Country
- company: Current or most recent company
- position: Current or most recent job title
- title: Professional title or headline
- bio: A brief professional summary (2-3 sentences)
- website: Personal website URL
- linkedin: LinkedIn profile URL

Return ONLY the JSON object, no additional text or explanation."""

    try:
        completion = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Parse this resume text:\n\n{text}"}
            ],
            temperature=0.1,
            max_tokens=1000
        )
        
        response_text = completion.choices[0].message.content.strip()
        
        # Try to extract JSON from the response
        try:
            # Remove any markdown formatting if present
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            parsed_data = json.loads(response_text.strip())
            return ParsedResume(**parsed_data)
            
        except json.JSONDecodeError:
            # Fallback: try to extract basic info without LLM
            return extract_basic_info(text)
            
    except Exception as e:
        # Fallback: try to extract basic info without LLM
        return extract_basic_info(text)

def extract_basic_info(text: str) -> ParsedResume:
    """Fallback method to extract basic information without LLM"""
    lines = text.split('\n')
    
    # Simple extraction logic
    name = None
    email = None
    phone = None
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Extract email
        if '@' in line and '.' in line and not email:
            email = line
            
        # Extract phone (simple pattern)
        if any(char.isdigit() for char in line) and len(line.replace(' ', '').replace('-', '').replace('(', '').replace(')', '')) >= 10 and not phone:
            phone = line
            
        # Extract name (first non-empty line that looks like a name)
        if not name and len(line.split()) <= 4 and not '@' in line and not any(char.isdigit() for char in line):
            name = line
    
    return ParsedResume(
        name=name,
        email=email,
        phone=phone,
        location=None,
        company=None,
        position=None,
        title=None,
        bio=None,
        website=None,
        linkedin=None
    )

@app.post("/parse-resume", response_model=ParsedResume)
async def parse_resume(file: UploadFile = File(...)):
    """Parse PDF resume and extract structured data"""
    
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    try:
        # Read the uploaded file
        pdf_content = await file.read()
        
        # Extract text from PDF
        text = extract_text_from_pdf(pdf_content)
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="No text could be extracted from the PDF")
        
        # Extract structured data using Groq LLM
        parsed_data = extract_resume_data_with_groq(text)
        
        return parsed_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process resume: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "PDF Parser Microservice"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 