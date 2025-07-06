# PDF Parser Microservice

A FastAPI-based microservice for parsing PDF resumes and extracting structured data using Groq LLM.

## Features

- PDF text extraction using PyPDF2
- Structured data extraction using Groq LLM
- RESTful API with FastAPI
- CORS enabled for frontend integration
- Fallback parsing when LLM is unavailable

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env and add your GROQ_API_KEY
   ```

3. **Run locally:**
   ```bash
   python main.py
   ```

## API Endpoints

### POST /parse-resume
Upload a PDF resume and get structured data.

**Request:** Multipart form with PDF file
**Response:** JSON with extracted fields

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-123-4567",
  "location": "San Francisco, CA",
  "company": "Tech Corp",
  "position": "Software Engineer",
  "title": "Full Stack Developer",
  "bio": "Experienced software engineer with 5+ years...",
  "website": "https://johndoe.com",
  "linkedin": "https://linkedin.com/in/johndoe"
}
```

### GET /health
Health check endpoint.

## Deployment on Render

1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python main.py`
   - **Environment Variables:** Add `GROQ_API_KEY`

4. **Deploy!**

## Frontend Integration

Update your Next.js frontend to call this microservice instead of the local API:

```javascript
const response = await fetch('https://your-render-service.onrender.com/parse-resume', {
  method: 'POST',
  body: formData
});
```

## Error Handling

The service includes fallback parsing when:
- Groq API is unavailable
- LLM response is malformed
- PDF parsing fails

All errors return appropriate HTTP status codes and error messages. 