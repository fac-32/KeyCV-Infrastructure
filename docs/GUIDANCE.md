# AI Toolkit Usage Guidance

This guide provides best practices and tips for using the KeyCV AI Toolkit efficiently and effectively.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Feature-Specific Guidance](#feature-specific-guidance)
3. [Optimization Tips](#optimization-tips)
4. [Workflow Recommendations](#workflow-recommendations)
5. [Cost Management](#cost-management)
6. [Security Best Practices](#security-best-practices)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Initial Setup

1. **Obtain API Credentials**
   - Sign up at [Anthropic Console](https://console.anthropic.com/)
   - Generate an API key
   - Start with the free tier to test the implementation
   - Monitor your usage in the Anthropic dashboard

2. **Configure Environment**

   ```bash
   cd backend
   cp .env.example .env.local
   ```

   Add your API key to `.env.local`:

   ```env
   ANTHROPIC_API_KEY="sk-ant-your-actual-key-here"
   PORT=3000
   ```

3. **Install and Start**

   ```bash
   npm install
   npm run dev
   ```

4. **Verify Setup**

   ```bash
   # Test health endpoint
   curl http://localhost:3000/health

   # Test a simple AI endpoint
   curl -X POST http://localhost:3000/api/ai/generate-interview-questions \
     -H "Content-Type: application/json" \
     -d '{
       "jobDescription": "Looking for a software engineer with JavaScript experience",
       "jobTitle": "Software Engineer"
     }'
   ```

---

## Feature-Specific Guidance

### 1. Resume and Job Description Analysis

**Purpose:** Get an objective assessment of how well a resume matches a job posting.

**When to Use:**

- Before applying to a specific job
- When tailoring a resume for a particular role
- To identify gaps in qualifications
- For resume optimization guidance

**Best Practices:**

1. **Provide Complete Information**

   ```json
   {
     "resumeText": "Include full resume with all sections: summary, experience, education, skills, projects",
     "jobDescription": "Include complete job posting: requirements, responsibilities, preferred qualifications, company info"
   }
   ```

2. **Format Tips**
   - Use plain text format (no special characters or formatting)
   - Include all sections of the resume
   - Copy the entire job description, not just bullet points
   - Remove any PII (Personally Identifiable Information) if sharing with others

3. **Interpreting Results**
   - **Match Score 0-50%:** Significant gaps, consider if you're qualified
   - **Match Score 51-70%:** Good foundation, focus on highlighted missing keywords
   - **Match Score 71-85%:** Strong match, minor improvements needed
   - **Match Score 86-100%:** Excellent match, minimal changes required

4. **Action Items**
   - Focus on top 3-5 missing keywords that you actually possess
   - Don't add keywords you don't have experience with
   - Use recommendations to restructure existing content, not fabricate experience

**Example Workflow:**

```bash
# 1. Run analysis
curl -X POST http://localhost:3000/api/ai/analyze-resume \
  -H "Content-Type: application/json" \
  -d @resume-analysis-request.json > analysis-result.json

# 2. Review missing keywords
cat analysis-result.json | jq '.missingKeywords'

# 3. Update resume based on recommendations

# 4. Re-run analysis to verify improvements
```

---

### 2. Resume Bullet Point Rewriter

**Purpose:** Transform weak or generic bullet points into impactful, results-oriented statements.

**When to Use:**

- After receiving analysis showing weak experience descriptions
- When you have accomplishments but struggle to articulate them
- To apply the STAR method to your experience
- To tailor bullet points to specific job requirements

**Best Practices:**

1. **Input Quality**
   - Provide bullet points with some context, even if poorly worded
   - Include basic information about what you did
   - Mention any metrics or outcomes you remember

   **Poor Input:**

   ```text
   "Did website work"
   ```

   **Good Input:**

   ```text
   "Worked on the company website and made it faster. Users seemed happier."
   ```

2. **Provide Context via Job Description**
   - The more detailed the job description, the better the tailoring
   - Include specific technologies and methodologies mentioned in the job posting

3. **Review and Personalize**
   - Always review the rewritten bullet point
   - Verify all claims are accurate
   - Adjust numbers to reflect your actual achievements
   - Ensure the tone matches your resume style

4. **Iterate as Needed**
   - If the first result isn't perfect, try rewording your input
   - You can run the same bullet point multiple times with different job descriptions

**Example Workflow:**

```bash
# Rewrite multiple bullet points for the same job
for bullet in "Led team meetings" "Fixed bugs" "Improved database"; do
  echo "Rewriting: $bullet"
  curl -X POST http://localhost:3000/api/ai/rewrite-bullet \
    -H "Content-Type: application/json" \
    -d "{
      \"bulletPoint\": \"$bullet\",
      \"jobDescription\": \"$(cat target-job.txt)\"
    }" | jq '.rewrittenBulletPoint'
done
```

---

### 3. Cover Letter Generator

**Purpose:** Create a personalized, professional cover letter tailored to a specific job and company.

**When to Use:**

- When a cover letter is required or optional but recommended
- For roles where you want to stand out
- When you need to explain career transitions or gaps
- To highlight specific experiences relevant to the role

**Best Practices:**

1. **Comprehensive Input**

   ```json
   {
     "resumeText": "Full resume content",
     "jobDescription": "Complete job posting",
     "companyName": "Exact company name from posting",
     "jobTitle": "Exact job title from posting",
     "keyPoints": [
       "Leadership experience managing remote teams",
       "Successful migration of legacy systems to cloud",
       "Open source contributions to related projects"
     ]
   }
   ```

2. **Key Points Strategy**
   - Limit to 2-4 key points
   - Choose accomplishments directly relevant to the role
   - Highlight what makes you unique
   - Include soft skills that match company culture

3. **Post-Generation Editing**
   - Add the hiring manager's name if known
   - Personalize the opening paragraph with company-specific details
   - Add a closing paragraph with your contact information
   - Adjust tone to match company culture (formal vs. casual)
   - Proofread for accuracy and remove any hallucinated information

4. **Company Research Integration**
   - Research the company before generating
   - Add specific company values or recent news to key points
   - Mention why you're specifically interested in this company

**Example:**

```bash
# Generate cover letter with specific emphasis
curl -X POST http://localhost:3000/api/ai/generate-cover-letter \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "...",
    "jobDescription": "...",
    "companyName": "TechCorp",
    "jobTitle": "Senior Backend Engineer",
    "keyPoints": [
      "8 years building scalable microservices",
      "Led migration serving 10M+ users",
      "Active contributor to Go open source community"
    ]
  }' | jq -r '.coverLetter' > cover-letter.txt

# Review and edit
nano cover-letter.txt
```

---

### 4. Interview Questions Generator

**Purpose:** Prepare for interviews with likely questions based on the job description.

**When to Use:**

- As soon as you get an interview invitation
- During interview preparation phase
- To identify knowledge gaps before the interview
- For mock interview practice

**Best Practices:**

1. **Input Preparation**
   - Use the complete job description
   - Include the exact job title
   - Add company name for context-specific questions

2. **Using the Results**
   - Prepare answers for each question
   - Use the STAR method for behavioral questions
   - Practice technical questions with actual coding/examples
   - Research additional questions for each topic mentioned

3. **Answer Preparation Strategy**
   - **Technical Questions:** Prepare code examples, diagrams, or explanations
   - **Behavioral Questions:** Identify 5-7 stories from your experience that can answer multiple questions
   - Write brief notes for each answer
   - Practice aloud to refine delivery

4. **Beyond the Generated Questions**
   - Use generated questions as a starting point
   - Research company-specific interview questions on Glassdoor
   - Prepare questions to ask the interviewer
   - Practice with a friend or mentor

**Example Workflow:**

```bash
# Generate questions
curl -X POST http://localhost:3000/api/ai/generate-interview-questions \
  -H "Content-Type: application/json" \
  -d @job-details.json > interview-questions.json

# Create answer template
cat interview-questions.json | jq -r '
  .technicalQuestions[] as $q |
  "## \($q)\n\n**Answer:**\n\n**Example:**\n\n---\n"
' > technical-prep.md

cat interview-questions.json | jq -r '
  .behavioralQuestions[] as $q |
  "## \($q)\n\n**Situation:**\n**Task:**\n**Action:**\n**Result:**\n\n---\n"
' > behavioral-prep.md

# Fill in your answers
code technical-prep.md behavioral-prep.md
```

---

## Optimization Tips

### 1. Batch Processing

Process multiple applications efficiently:

```bash
#!/bin/bash
# batch-process.sh

JOBS_DIR="./job-applications"

for job_folder in "$JOBS_DIR"/*; do
  JOB_NAME=$(basename "$job_folder")
  echo "Processing $JOB_NAME..."

  # Analyze resume
  curl -s -X POST http://localhost:3000/api/ai/analyze-resume \
    -H "Content-Type: application/json" \
    -d @"$job_folder/analysis-request.json" \
    > "$job_folder/analysis-result.json"

  # Generate cover letter
  curl -s -X POST http://localhost:3000/api/ai/generate-cover-letter \
    -H "Content-Type: application/json" \
    -d @"$job_folder/cover-letter-request.json" \
    > "$job_folder/cover-letter.json"

  # Generate interview questions
  curl -s -X POST http://localhost:3000/api/ai/generate-interview-questions \
    -H "Content-Type: application/json" \
    -d @"$job_folder/interview-request.json" \
    > "$job_folder/interview-questions.json"

  echo "Completed $JOB_NAME"
done
```

### 2. Template Reuse

Create reusable templates for common request patterns:

```bash
# templates/analysis-template.json
{
  "resumeText": "{{RESUME_TEXT}}",
  "jobDescription": "{{JOB_DESCRIPTION}}"
}

# Script to fill template
sed -e "s|{{RESUME_TEXT}}|$(cat my-resume.txt)|g" \
    -e "s|{{JOB_DESCRIPTION}}|$(cat job-posting.txt)|g" \
    templates/analysis-template.json > request.json
```

### 3. Response Caching

For testing or when re-processing, cache responses:

```bash
#!/bin/bash
# cached-request.sh

CACHE_KEY=$(echo -n "$REQUEST_BODY" | md5)
CACHE_FILE="cache/$CACHE_KEY.json"

if [ -f "$CACHE_FILE" ]; then
  echo "Using cached response"
  cat "$CACHE_FILE"
else
  echo "Making API request"
  curl -X POST http://localhost:3000/api/ai/analyze-resume \
    -H "Content-Type: application/json" \
    -d "$REQUEST_BODY" | tee "$CACHE_FILE"
fi
```

---

## Workflow Recommendations

### Job Application Workflow

**1\. Initial Analysis (Day 1)**

```text
Job Posting Found
      ↓
Resume Analysis
      ↓
Review Match Score & Missing Keywords
      ↓
Decision: Apply or Pass?
```

**2\. Resume Tailoring (Day 1-2)**

```text
Identify Weak Bullet Points
      ↓
Rewrite Bullet Points (2-3 at a time)
      ↓
Update Resume
      ↓
Re-run Analysis
      ↓
Verify Improvement
```

**3\. Application Materials (Day 2)**

```text
Generate Cover Letter
      ↓
Personalize & Edit
      ↓
Proofread
      ↓
Submit Application
```

**4\. Interview Prep (Upon Interview Invitation)**

```text
Generate Interview Questions
      ↓
Prepare Answers
      ↓
Practice
      ↓
Interview Ready
```

### Weekly Batch Processing

For active job seekers applying to multiple positions:

```text
Monday: Collect 5-10 job postings
Tuesday: Run resume analysis for all
Wednesday: Tailor resumes based on top 3 matches
Thursday: Generate cover letters
Friday: Submit applications
Weekend: Interview prep for any scheduled interviews
```

---

## Cost Management

### Understanding API Costs

- Anthropic Claude charges per token (input + output)
- Approximate costs per feature (as of 2024):
  - Resume Analysis: ~$0.02-0.05 per request
  - Bullet Point Rewriter: ~$0.01-0.02 per request
  - Cover Letter Generation: ~$0.03-0.06 per request
  - Interview Questions: ~$0.02-0.04 per request

### Cost Optimization Strategies

1. **Be Selective**
   - Only use AI tools for jobs you're seriously considering
   - Do manual research first to filter opportunities

2. **Optimize Input Length**
   - Remove unnecessary content from resumes (keep it to 2 pages max)
   - Extract only relevant portions of lengthy job descriptions
   - For bullet point rewriting, process only key achievements

3. **Batch Similar Requests**
   - Rewrite multiple bullet points for the same job in sequence
   - Generate all materials for a job in one session

4. **Reuse When Possible**
   - Save and reuse cover letters for similar roles (with minor edits)
   - Keep a library of rewritten bullet points
   - Maintain a master resume with all variations

5. **Monitor Usage**
   - Check Anthropic console regularly
   - Set up billing alerts
   - Track which features you use most

6. **Use Free Tier Wisely**
   - Many LLM providers offer free credits for new users
   - Use free tier for testing and initial setup
   - Optimize your workflows before scaling up

---

## Security Best Practices

### Protecting Sensitive Information

1. **API Key Security**

   ```bash
   # NEVER commit .env.local
   git status
   # Verify .env.local is in .gitignore

   # Use environment-specific keys
   # Development: Limited quota key
   # Production: Full quota key with rate limiting
   ```

2. **Personal Information Handling**
   - Remove PII before using AI features:
     - Full addresses
     - Phone numbers
     - Email addresses
     - Social Security numbers
     - Dates of birth
   - Use placeholders: "[Name]", "[Address]", "[Phone]"

3. **Access Control**

   ```bash
   # Restrict access to .env.local
   chmod 600 backend/.env.local

   # Don't share API keys
   # Generate separate keys for team members
   ```

4. **Secure Transmission**
   - Always use HTTPS in production
   - Don't log request/response bodies containing resumes
   - Implement request size limits (already set to 10MB)

5. **Data Retention**
   - Anthropic may retain data for abuse prevention (30 days)
   - Don't send confidential company information
   - Review Anthropic's data usage policy

### Production Considerations

```typescript
// Example: Implement rate limiting
import rateLimit from 'express-rate-limit';

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many requests, please try again later.'
});

app.use('/api/ai', aiLimiter);
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. API Key Errors

**Error:** `ANTHROPIC_API_KEY is not set`

**Solutions:**

```bash
# Verify .env.local exists
ls -la backend/.env.local

# Check file contents
cat backend/.env.local

# Ensure no quotes around the key in code
# ANTHROPIC_API_KEY=sk-ant-... (correct)
# ANTHROPIC_API_KEY="sk-ant-..." (also correct)

# Restart server after changing .env.local
npm run dev
```

#### 2. Request Timeout

**Error:** Request takes too long or times out

**Solutions:**

- Reduce input size (shorten resume or job description)
- Check internet connection
- Verify Anthropic API status: <https://status.anthropic.com/>
- Increase timeout in your client code

#### 3. Invalid Response Format

**Error:** `Failed to parse JSON response`

**Solutions:**

```bash
# This is usually temporary, try again
# If persistent, check the raw response:
curl -X POST http://localhost:3000/api/ai/analyze-resume \
  -H "Content-Type: application/json" \
  -d @request.json -v > response.txt 2>&1

# Examine response.txt for errors
```

#### 4. Poor Quality Results

**Problem:** Generated content doesn't meet expectations

**Solutions:**

- Provide more detailed input
- Include complete job descriptions
- For bullet points, provide more context about achievements
- Try rewording your input
- Run multiple times and pick the best result

#### 5. Rate Limiting

**Error:** `429 Too Many Requests`

**Solutions:**

```bash
# Wait before retrying
sleep 60

# Implement exponential backoff
# Reduce request frequency
# Consider upgrading API plan
```

#### 6. Build Errors

**Error:** TypeScript compilation errors

**Solutions:**

```bash
# Clean build artifacts
rm -rf backend/dist
rm -rf backend/src/**/*.js backend/src/**/*.d.ts backend/src/**/*.map

# Rebuild
cd backend
npm run build

# Check for errors
npx tsc --noEmit
```

### Getting Help

1. **Check Documentation**
   - Review `docs/API.md` for API details
   - Check Anthropic documentation: <https://docs.anthropic.com/>

2. **Enable Debug Logging**

   ```typescript
   // Add to llm.service.ts for debugging
   console.log('Request:', JSON.stringify(request, null, 2));
   console.log('Response:', JSON.stringify(response, null, 2));
   ```

3. **Test with Minimal Input**

   ```bash
   # Use simple, minimal input to isolate issues
   curl -X POST http://localhost:3000/api/ai/rewrite-bullet \
     -H "Content-Type: application/json" \
     -d '{
       "bulletPoint": "Worked on project",
       "jobDescription": "Looking for developer"
     }'
   ```

4. **Check Server Logs**

   ```bash
   # Watch server output for errors
   npm run dev
   # Look for error messages in console
   ```

---

## Best Practices Summary

### Do's ✅

- ✅ Provide complete, well-formatted input
- ✅ Review and personalize all AI-generated content
- ✅ Use AI as a starting point, not the final product
- ✅ Verify all claims and numbers in generated content
- ✅ Test with your own data to understand capabilities
- ✅ Monitor API usage and costs
- ✅ Keep API keys secure
- ✅ Remove PII before processing
- ✅ Save successful outputs for future reference
- ✅ Iterate and refine based on results

### Don'ts ❌

- ❌ Don't fabricate experience based on AI suggestions
- ❌ Don't submit AI-generated content without review
- ❌ Don't include sensitive company information
- ❌ Don't share API keys or commit them to git
- ❌ Don't rely solely on match scores for decision-making
- ❌ Don't use AI suggestions that don't reflect your actual experience
- ❌ Don't send the same cover letter to multiple companies
- ❌ Don't exceed API rate limits
- ❌ Don't ignore error messages
- ❌ Don't use in production without proper security measures

---

## Conclusion

The KeyCV AI Toolkit is designed to enhance your job application process, not replace your judgment and authentic voice. Use these tools to:

- **Save time** on repetitive tasks
- **Improve quality** of application materials
- **Gain insights** into job requirements
- **Prepare effectively** for interviews

Remember: The best results come from combining AI assistance with your own expertise, authenticity, and effort. Good luck with your job search!

---

## Additional Resources

- **API Documentation:** `docs/API.md`
- **Anthropic Documentation:** <https://docs.anthropic.com/>
- **Resume Writing Resources:**
  - Harvard Resume Guide
  - The Muse Resume Tips
  - Indeed Career Guide
- **Interview Preparation:**
  - Glassdoor Interview Questions
  - LeetCode (for technical roles)
  - Behavioral Interview Prep Guides

---

- **Last Updated: November 2025** *
