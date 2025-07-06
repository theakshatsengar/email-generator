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
        all_links = []
        
        for page_num, page in enumerate(pdf_reader.pages):
            try:
                # Extract text
                page_text = page.extract_text()
                text += page_text + "\n"
                
                # Extract links from annotations (clickable links)
                try:
                    if '/Annots' in page:
                        for annot in page['/Annots']:
                            try:
                                annot_obj = annot.get_object()
                                if annot_obj.get('/Subtype') == '/Link':
                                    if '/A' in annot_obj and '/URI' in annot_obj['/A']:
                                        link_url = annot_obj['/A']['/URI']
                                        all_links.append(link_url)
                            except Exception as annot_error:
                                print(f"Error processing annotation: {annot_error}")
                                continue
                except Exception as annots_error:
                    print(f"Error processing annotations on page {page_num}: {annots_error}")
                    continue
                    
            except Exception as page_error:
                print(f"Error processing page {page_num}: {page_error}")
                continue
        
        # Also extract visible links from text
        try:
            visible_links = re.findall(r'https?://[^\s]+', text)
            all_links.extend(visible_links)
        except Exception as regex_error:
            print(f"Error extracting visible links: {regex_error}")
        
        # Remove duplicates and add to text
        unique_links = list(set(all_links))
        if unique_links:
            text += "\n\nAll Links Found:\n" + "\n".join(unique_links)
        
        if not text.strip():
            raise Exception("No text could be extracted from the PDF")
            
        return text.strip()
    except Exception as e:
        print(f"PDF parsing error: {str(e)}")
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
  "bio": "Create a detailed professional summary (3-4 sentences) that includes: years of experience, key skills, notable achievements, and career highlights. Make it compelling and professional.",
  "website": "Personal website URL",
  "linkedin": "LinkedIn profile URL"
}

IMPORTANT: 
- For bio: Create a comprehensive professional summary that highlights experience, skills, achievements, and career progression
- For links: Look for both visible URLs and any link references in the text
- Be thorough in extracting all available information

Return ONLY the JSON object. No explanations, no markdown formatting, just the JSON data."""

    try:
        print(f"Sending text to LLM (length: {len(text)})")
        
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
        print(f"LLM response received (length: {len(response_text)})")
        
        # Clean response and extract JSON
        cleaned_response = response_text
        
        # Remove markdown code blocks
        if cleaned_response.startswith("```json"):
            cleaned_response = cleaned_response[7:]
        if cleaned_response.endswith("```"):
            cleaned_response = cleaned_response[:-3]
            
        # Remove any text before the JSON object
        json_start = cleaned_response.find('{')
        if json_start != -1:
            cleaned_response = cleaned_response[json_start:]
        
        # Find the end of the JSON object
        brace_count = 0
        json_end = -1
        for i, char in enumerate(cleaned_response):
            if char == '{':
                brace_count += 1
            elif char == '}':
                brace_count -= 1
                if brace_count == 0:
                    json_end = i + 1
                    break
        
        if json_end != -1:
            cleaned_response = cleaned_response[:json_end]
        
        try:
            parsed_json = json.loads(cleaned_response.strip())
            print("JSON parsed successfully")
            return parsed_json
        except json.JSONDecodeError as json_error:
            print(f"JSON parsing error: {json_error}")
            print(f"Original response: {response_text[:500]}...")
            print(f"Cleaned response: {cleaned_response[:500]}...")
            raise Exception(f"Invalid JSON response from LLM: {json_error}")
        
    except Exception as e:
        print(f"LLM error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate JSON: {str(e)}")

@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    """Parse PDF resume and return JSON data"""
    
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    try:
        print(f"Processing PDF: {file.filename}")
        
        # Step 1: Extract all text and links from PDF
        pdf_content = await file.read()
        print(f"PDF size: {len(pdf_content)} bytes")
        
        text = extract_text_and_links_from_pdf(pdf_content)
        print(f"Extracted text length: {len(text)} characters")
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="No text could be extracted from the PDF")
        
        # Step 2: Generate JSON data using LLM
        json_data = generate_json_from_text(text)
        print("JSON generation completed successfully")
        
        return json_data
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
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