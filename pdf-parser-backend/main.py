from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
import io
import os
import re
from groq import Groq
import json
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="PDF Parser Microservice", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def extract_text_and_links_from_pdf(pdf_file: bytes) -> str:
    """Extract all text and links from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_file))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        
        # Extract links from text
        links = re.findall(r'https?://[^\s]+', text)
        if links:
            text += "\n\nLinks found:\n" + "\n".join(links)
        
        return text.strip()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse PDF: {str(e)}")

def generate_json_from_text(text: str) -> dict:
    """Use LLM to generate JSON data from resume text"""
    
    system_prompt = """You are a resume parser. Extract the following information and return ONLY a JSON object:

{
  "name": "Full name of the person",
  "email": "Email address", 
  "phone": "Phone number",
  "location": "City, State/Country",
  "company": "Current or most recent company",
  "position": "Current or most recent job title",
  "title": "Professional title or headline",
  "bio": "A brief professional summary (2-3 sentences)",
  "website": "Personal website URL",
  "linkedin": "LinkedIn profile URL"
}

Return ONLY the JSON object. No explanations, no markdown formatting, just the JSON data."""

    try:
        completion = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Extract all fields from this resume:\n\n{text}"}
            ],
            temperature=0.1,
            max_tokens=1000
        )
        
        response_text = completion.choices[0].message.content.strip()
        
        # Clean response and parse JSON
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        return json.loads(response_text.strip())
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate JSON: {str(e)}")

@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    """Parse PDF resume and return JSON data"""
    
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    try:
        # Step 1: Extract all text and links from PDF
        pdf_content = await file.read()
        text = extract_text_and_links_from_pdf(pdf_content)
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="No text could be extracted from the PDF")
        
        # Step 2: Generate JSON data using LLM
        json_data = generate_json_from_text(text)
        
        return json_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process resume: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "PDF Parser Microservice"}

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "PDF Parser Microservice is running!"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 