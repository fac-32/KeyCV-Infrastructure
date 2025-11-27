# AI Toolkit API Documentation

This document provides detailed information about the AI-powered endpoints available in the KeyCV backend service.

## Setup

Before using the AI endpoints, you need to:

1. Create a `.env.local` file in the `backend/` directory:

   ```bash
   cp backend/.env.example backend/.env.local
   ```

2. Get your Anthropic API key from [https://console.anthropic.com/](https://console.anthropic.com/)

3. Add your API key to `.env.local`:

   ```env
   ANTHROPIC_API_KEY="your_actual_api_key_here"
   PORT=3000
   ```

4. Install dependencies and start the server:

   ```bash
   cd backend
   npm install
   npm run dev  # For development
   # OR
   npm run build && npm start  # For production
   ```

## API Endpoints

All AI endpoints are prefixed with `/api/ai` and accept JSON request bodies.

### 1. Resume and Job Description Analysis

**Endpoint:** `POST /api/ai/analyze-resume`

**Description:** Analyzes a resume against a job description to provide a match score, present/missing keywords, and recommendations.

**Request Body:**

```json
{
  "resumeText": "Your full resume text here...",
  "jobDescription": "The job description text here..."
}
```

**Response:**

```json
{
  "matchScore": 75,
  "presentKeywords": ["JavaScript", "React", "Node.js", "TypeScript", "Git"],
  "missingKeywords": ["AWS", "Docker", "Kubernetes", "CI/CD", "GraphQL"],
  "recommendations": [
    "Add cloud platform experience (AWS/Azure)",
    "Highlight DevOps skills if you have them",
    "Emphasize containerization knowledge",
    "Include GraphQL experience if applicable",
    "Showcase CI/CD pipeline experience"
  ]
}
```

**Example cURL:**

```bash
curl -X POST http://localhost:3000/api/ai/analyze-resume \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "Senior Software Engineer with 5 years of experience in JavaScript, React, Node.js...",
    "jobDescription": "We are looking for a Full Stack Developer with experience in React, Node.js, AWS..."
  }'
```

---

### 2. Resume Bullet Point Rewriter

**Endpoint:** `POST /api/ai/rewrite-bullet`

**Description:** Rewrites a resume bullet point to be more impactful using the STAR method and tailored to the job description.

**Request Body:**

```json
{
  "bulletPoint": "Worked on the website",
  "jobDescription": "Looking for a frontend developer with React experience..."
}
```

**Response:**

```json
{
  "originalBulletPoint": "Worked on the website",
  "rewrittenBulletPoint": "Led the development of a responsive React-based web application, implementing modern UI components that improved user engagement by 40% and reduced page load time by 25%",
  "improvements": [
    "Added quantifiable results",
    "Used strong action verb 'Led'",
    "Specified technologies (React)",
    "Highlighted impact on user engagement"
  ]
}
```

**Example cURL:**

```bash
curl -X POST http://localhost:3000/api/ai/rewrite-bullet \
  -H "Content-Type: application/json" \
  -d '{
    "bulletPoint": "Worked on improving the database",
    "jobDescription": "Seeking a backend engineer with database optimization experience..."
  }'
```

---

### 3. Cover Letter Generation

**Endpoint:** `POST /api/ai/generate-cover-letter`

**Description:** Generates a tailored, professional cover letter based on the resume and job description.

**Request Body:**

```json
{
  "resumeText": "Your full resume text here...",
  "jobDescription": "The job description text here...",
  "companyName": "Acme Corporation",
  "jobTitle": "Senior Software Engineer",
  "keyPoints": ["My leadership experience", "Open source contributions"]
}
```

Note: `keyPoints` is optional.

**Response:**

```json
{
  "coverLetter": "Dear Hiring Manager,\n\nI am writing to express my strong interest in the Senior Software Engineer position at Acme Corporation...\n\n[Full cover letter text]\n\nSincerely,\n[Your name]"
}
```

**Example cURL:**

```bash
curl -X POST http://localhost:3000/api/ai/generate-cover-letter \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "Senior Software Engineer with 5 years...",
    "jobDescription": "We are looking for a Senior Software Engineer...",
    "companyName": "TechCorp",
    "jobTitle": "Senior Software Engineer",
    "keyPoints": ["team leadership", "scalability expertise"]
  }'
```

---

### 4. Interview Questions Generator

**Endpoint:** `POST /api/ai/generate-interview-questions`

**Description:** Generates likely technical and behavioral interview questions based on the job description.

**Request Body:**

```json
{
  "jobDescription": "The job description text here...",
  "jobTitle": "Full Stack Developer",
  "companyName": "Acme Corp"
}
```

Note: `companyName` is optional.

**Response:**

```json
{
  "technicalQuestions": [
    "How would you optimize a React application's performance?",
    "Explain the event loop in Node.js",
    "What's your experience with RESTful API design?",
    "How do you handle database migrations in production?",
    "Describe your approach to writing testable code"
  ],
  "behavioralQuestions": [
    "Tell me about a time you had to debug a critical production issue",
    "How do you handle conflicting priorities in a project?",
    "Describe a situation where you had to learn a new technology quickly",
    "How do you ensure code quality in a team environment?",
    "Tell me about a project where you improved system performance"
  ]
}
```

**Example cURL:**

```bash
curl -X POST http://localhost:3000/api/ai/generate-interview-questions \
  -H "Content-Type: application/json" \
  -d '{
    "jobDescription": "Looking for a frontend developer with React and TypeScript...",
    "jobTitle": "Frontend Developer",
    "companyName": "StartupXYZ"
  }'
```

---

## Error Handling

All endpoints follow consistent error handling:

**400 Bad Request** - Missing required fields

```json
{
  "error": "Missing required fields: resumeText and jobDescription"
}
```

**500 Internal Server Error** - Server or API errors

```json
{
  "error": "Failed to analyze resume",
  "message": "Detailed error message here"
}
```

## Rate Limits

Be mindful of the Anthropic API rate limits. Each request uses Claude 3.5 Sonnet, which may have usage limits based on your API plan.

## Best Practices

1. **Resume Text**: Provide complete, well-formatted resume text for best results
2. **Job Descriptions**: Include full job description with requirements and responsibilities
3. **Error Handling**: Always check for error responses and handle them gracefully
4. **Response Time**: AI endpoints may take 3-10 seconds to respond depending on content length
5. **Security**: Never commit your `.env.local` file or expose your API key

## Testing

You can test the endpoints using:

- cURL (examples provided above)
- Postman (import the examples as requests)
- Thunder Client (VS Code extension)
- Your frontend application

## Next Steps

1. Set up your Anthropic API key
2. Test each endpoint with sample data
3. Integrate these endpoints into your frontend application
4. Monitor API usage and costs in the Anthropic console
