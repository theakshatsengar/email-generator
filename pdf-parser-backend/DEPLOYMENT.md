# Deployment Guide for PDF Parser Microservice

## Step 1: Prepare Your Repository

1. **Create a new GitHub repository** for the Python microservice
2. **Upload the files** from the `pdf-parser-backend` folder to your repository:
   - `main.py`
   - `requirements.txt`
   - `README.md`
   - `env.example`

## Step 2: Set Up Environment Variables

1. **Get your Groq API key** from [https://console.groq.com/](https://console.groq.com/)
2. **Create a `.env` file** in your repository:
   ```
   GROQ_API_KEY=your_actual_groq_api_key_here
   ```

## Step 3: Deploy on Render

1. **Go to [Render.com](https://render.com)** and sign up/login
2. **Click "New +"** and select "Web Service"
3. **Connect your GitHub repository**
4. **Configure the service:**

   **Basic Settings:**
   - **Name:** `pdf-parser-microservice` (or your preferred name)
   - **Environment:** `Python 3`
   - **Region:** Choose closest to your users
   - **Branch:** `main` (or your default branch)

   **Build & Deploy Settings:**
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python main.py`
   - **Plan:** Free (or paid if you need more resources)

   **Environment Variables:**
   - Add `GROQ_API_KEY` with your actual Groq API key

5. **Click "Create Web Service"**

## Step 4: Update Frontend Configuration

1. **Wait for deployment to complete** (usually 2-5 minutes)
2. **Copy your service URL** (e.g., `https://pdf-parser-microservice.onrender.com`)
3. **Update your Next.js frontend:**

   **Option A: Environment Variable**
   Create a `.env.local` file in your Next.js project:
   ```
   NEXT_PUBLIC_PDF_PARSER_URL=https://your-service-name.onrender.com
   ```

   **Option B: Direct Configuration**
   Update `config/microservice.ts`:
   ```typescript
   export const PDF_PARSER_URL = "https://your-service-name.onrender.com";
   ```

## Step 5: Test the Integration

1. **Start your Next.js development server**
2. **Open the personal info modal**
3. **Upload a PDF resume**
4. **Verify that the data is auto-filled correctly**

## Troubleshooting

### Common Issues:

1. **Service not starting:**
   - Check the build logs in Render
   - Ensure all dependencies are in `requirements.txt`
   - Verify the start command is correct

2. **CORS errors:**
   - The service is configured to allow all origins for development
   - For production, update the CORS settings in `main.py`

3. **API key issues:**
   - Verify your Groq API key is correct
   - Check that the environment variable is set in Render

4. **PDF parsing fails:**
   - Check if the PDF is text-based (not scanned images)
   - Verify the PDF file is not corrupted

### Monitoring:

- **Render Dashboard:** Monitor service health and logs
- **Health Check:** Visit `https://your-service.onrender.com/health`
- **API Testing:** Use tools like Postman to test the `/parse-resume` endpoint

## Production Considerations

1. **Security:**
   - Update CORS settings to only allow your frontend domain
   - Consider adding rate limiting
   - Add authentication if needed

2. **Performance:**
   - Monitor response times
   - Consider upgrading to a paid plan for better performance
   - Add caching if needed

3. **Reliability:**
   - Set up monitoring and alerts
   - Consider using a paid plan for better uptime
   - Implement retry logic in your frontend 