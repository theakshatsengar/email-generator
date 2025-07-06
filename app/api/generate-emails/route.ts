import { type NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY environment variable is not set")
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

function detectIntent(prompt: string): "reply" | "application" | "outreach" | "other" {
  const lower = prompt.toLowerCase()
  if (lower.includes("reply to") || lower.includes("respond to") || lower.includes("response to") || lower.includes("follow up on their email") || lower.includes("replying to")) {
    return "reply"
  }
  if (lower.includes("apply for") || lower.includes("application") || lower.includes("job") || lower.includes("role") || lower.includes("position") || lower.includes("opening") || lower.includes("hiring")) {
    return "application"
  }
  if (lower.includes("outreach") || lower.includes("connect with") || lower.includes("introduction") || lower.includes("partnership") || lower.includes("collaborate") || lower.includes("business")) {
    return "outreach"
  }
  return "other"
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, tone, userInfo } = await request.json()

    console.log("Received request:", { prompt, tone, userInfo })

    if (!prompt) {
      console.log("Error: Prompt is required")
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Detect intent
    const intent = detectIntent(prompt)
    console.log("Detected intent:", intent)

    let formatInstructions = ""
    if (intent === "reply") {
      formatInstructions = `You are replying to an email. Your reply should be concise, polite, and directly address the original message. Reference the sender's points, answer any questions, and keep the tone warm and human. Do NOT use the job application format.\n\n---\nSubject: [Re: original subject]\n\nHi [Recipient Name],\n\n[Reply content: Address the sender's points, answer questions, and be concise.]\n\nBest,\n[Your Name]\n---`;
    } else if (intent === "application") {
      formatInstructions = `You are writing a job application/outreach email. STRICTLY follow the format below for every email you generate. Do not deviate from this structure. Do not add or remove sections. Do not change the order. Use the user's prompt and info to fill in the details, but keep the structure identical.\n\n**IMPORTANT:** Keep the email VERY short and concise. Use a natural, warm, and human tone—never robotic or AI-generated. Use contractions and natural phrasing. Avoid generic or boilerplate language. Make it sound like a real person wrote it, not an AI.\n\n---\nSubject: [Direct, specific to the opportunity]\n\ntldr;\n[Short, personal summary about yourself, your motivation, and what you want]\n\nHi [Recipient Name],\n\n[Paragraph 1: Show genuine interest in the company and reference their work.]\n\n[Paragraph 2: Summarize your relevant experience, mentioning company names and links.]\n\n[Paragraph 3: Detail your technical skills, what you can bring to the team, and any unique value.]\n\n[Closing: Express desire to join, openness to connect, and a polite sign-off.]\n\nBest,\n[Your Name]\n---\n\nHere is a sample email for reference:\n\nSubject: RE: Engineering at Icon\n\ntldr;\nI love everything about what Icon is doing. I don't have many hobbies outside coding. I am not athletic, bad at singing, don't drink, can't dance. Building is the only thing I am good at. At this point, I want to be a part of taking something from 0 -> 1 or 1 -> 100. I just want to be heads down chasing that goal\n\nHi Kennan,\n\nReally loved what you were building at Icon and wanted to reach out to see if there were openings for Engineers in the early team. I have 5 years of relevant experience building full-stack applications primarily data-driven at DynamoAI (https://dynamo.ai), Antimetal (https://antimetal.com), Union.ai (https://union.ai), Synthesia (https://synthesia.io) and Alan (https://alan.app) as a part of their early teams where I helped scale internal micro-services to thousands of workflows and users.\n\nBeing a part of super lean teams, one of my strongest suites has been ability to work across the stack from building scalable, robust backend systems to high throughput data ingestion pipelines to production grade frontend components in React. As a part, I have build several end-to-end systems that involve several layers at the intersection of UI (Next.js), Backend (Python, Node + Go based services using GraphQL and GRPC) as well as infrastructure pieces (AWS + GCP over K8s) from building complex workflows, DAG visualizations and drag and drop component canvas for Union cloud to architecting the entire platform for Alan Studio and Synthesia.\n\nI would love to be a part of the early team at Icon and define its work and culture. Looking forward to hearing from you soon!\n\nBest,\nSoham\n---`;
    } else {
      formatInstructions = `You are writing a professional outreach or business email. Use a concise, human, and warm tone. Structure the email with a clear subject, a brief intro, the main message, and a polite closing. Do NOT use the job application format.\n\n---\nSubject: [Direct, specific to the opportunity]\n\nHi [Recipient Name],\n\n[Paragraph 1: Brief intro and context.]\n\n[Paragraph 2: Main message, request, or value proposition.]\n\n[Closing: Polite sign-off, openness to connect, or next steps.]\n\nBest,\n[Your Name]\n---`;
    }

    const systemPrompt = `
${formatInstructions}

Key principles:
1. Personal storytelling that creates genuine connection
2. Specific value propositions tailored to each opportunity  
3. Strategic follow-up sequences that maintain momentum
4. Professional tone variations for different contexts
5. Always include specific, actionable next steps

User Information:
${
  userInfo
    ? `
- Name: ${userInfo.name || "User"}
- Company: ${userInfo.company || "N/A"}
- Position: ${userInfo.position || "N/A"}
- Location: ${userInfo.location || "N/A"}
- Bio: ${userInfo.bio || "N/A"}
- Email: ${userInfo.email || "N/A"}
`
    : "No user information provided"
}

Generate exactly 5 different email templates based on the user's prompt. Each email should have a different approach and tone (Professional, Friendly, Formal, Appreciative, Collaborative).

Return the response as a JSON array with this exact structure:
[
  {
    "id": 1,
    "subject": "Email subject line",
    "content": "Full email content with proper formatting and line breaks",
    "tone": "Professional"
  },
  {
    "id": 2,
    "subject": "Email subject line", 
    "content": "Full email content with proper formatting and line breaks",
    "tone": "Friendly"
  },
  {
    "id": 3,
    "subject": "Email subject line",
    "content": "Full email content with proper formatting and line breaks", 
    "tone": "Formal"
  },
  {
    "id": 4,
    "subject": "Email subject line",
    "content": "Full email content with proper formatting and line breaks",
    "tone": "Appreciative"
  },
  {
    "id": 5,
    "subject": "Email subject line",
    "content": "Full email content with proper formatting and line breaks",
    "tone": "Collaborative"
  }
]

IMPORTANT: Return ONLY the JSON array. Do not include any markdown formatting, explanations, or additional text. The response must be valid JSON that can be parsed directly.
`

    const userPrompt = `Generate 5 email templates for this scenario: ${prompt}

Preferred tone: ${tone || "professional"}

Please create emails that follow the above method and return them in the exact JSON format specified. Return ONLY the JSON array.`

    console.log("Sending request to Groq API...")

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2000,
    })

    const responseContent = completion.choices[0]?.message?.content || ""
    
    console.log("Raw AI response:", responseContent)
    console.log("Response length:", responseContent.length)

    // Try to parse the JSON response
    let emailTemplates
    try {
      // Clean the response content
      let cleanedContent = responseContent.trim()
      
      // Remove markdown code blocks if present
      cleanedContent = cleanedContent.replace(/```json\s*/g, '').replace(/```\s*$/g, '')
      
      // Remove any leading/trailing text that's not JSON
      const jsonMatch = cleanedContent.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error("No JSON array found in response")
      }
      
      const jsonString = jsonMatch[0]
      console.log("Extracted JSON string:", jsonString)
      
      // Clean control characters and escape sequences
      const sanitizedJson = jsonString
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
        .replace(/\n/g, '\\n') // Properly escape newlines
        .replace(/\r/g, '\\r') // Properly escape carriage returns
        .replace(/\t/g, '\\t') // Properly escape tabs
      
      console.log("Sanitized JSON:", sanitizedJson)
      
      emailTemplates = JSON.parse(sanitizedJson)
      console.log("Successfully parsed email templates:", emailTemplates)
      
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError)
      console.error("Response content that failed to parse:", responseContent)
      
      // Return error instead of fallback templates
      return NextResponse.json({ 
        error: "Failed to parse AI response", 
        details: parseError instanceof Error ? parseError.message : "Unknown parsing error",
        rawResponse: responseContent.substring(0, 500) // First 500 chars for debugging
      }, { status: 500 })
    }

    // Validate the response structure
    if (!Array.isArray(emailTemplates)) {
      console.error("Response is not an array:", emailTemplates)
      return NextResponse.json({ 
        error: "Invalid response format - expected array",
        received: typeof emailTemplates
      }, { status: 500 })
    }

    if (emailTemplates.length !== 5) {
      console.error("Expected 5 templates, got:", emailTemplates.length)
      return NextResponse.json({ 
        error: "Invalid number of templates",
        expected: 5,
        received: emailTemplates.length
      }, { status: 500 })
    }

    // Validate each template has required fields
    for (let i = 0; i < emailTemplates.length; i++) {
      const template = emailTemplates[i]
      if (!template.id || !template.subject || !template.content || !template.tone) {
        console.error(`Template ${i} missing required fields:`, template)
        return NextResponse.json({ 
          error: `Template ${i} missing required fields`,
          template
        }, { status: 500 })
      }
    }

    console.log("Successfully generated email templates")
    return NextResponse.json({ templates: emailTemplates })
    
  } catch (error) {
    console.error("Error generating emails:", error)
    return NextResponse.json({ 
      error: "Failed to generate email templates",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 