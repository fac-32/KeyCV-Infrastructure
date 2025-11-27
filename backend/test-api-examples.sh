#!/bin/bash

# AI Toolkit API Test Examples
# Make this file executable: chmod +x test-api-examples.sh

BASE_URL="http://localhost:3000/api/ai"

echo "Testing AI Toolkit API Endpoints..."
echo "===================================="
echo ""

# Test 1: Resume Analysis
echo "1. Testing Resume Analysis..."
curl -X POST "$BASE_URL/analyze-resume" \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "Senior Software Engineer with 5 years of experience in JavaScript, React, Node.js, TypeScript, and Git. Led team of 4 developers. Built scalable web applications.",
    "jobDescription": "We are looking for a Full Stack Developer with experience in React, Node.js, AWS, Docker, Kubernetes, and CI/CD pipelines."
  }' | json_pp
echo ""
echo "---"
echo ""

# Test 2: Bullet Point Rewriter
echo "2. Testing Bullet Point Rewriter..."
curl -X POST "$BASE_URL/rewrite-bullet" \
  -H "Content-Type: application/json" \
  -d '{
    "bulletPoint": "Worked on improving database performance",
    "jobDescription": "Seeking a backend engineer with database optimization experience and strong SQL skills."
  }' | json_pp
echo ""
echo "---"
echo ""

# Test 3: Cover Letter Generation
echo "3. Testing Cover Letter Generation..."
curl -X POST "$BASE_URL/generate-cover-letter" \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "Senior Software Engineer with 5 years of experience in full-stack development. Proficient in React, Node.js, and cloud technologies.",
    "jobDescription": "Looking for a Senior Software Engineer to lead our frontend team.",
    "companyName": "TechCorp",
    "jobTitle": "Senior Software Engineer",
    "keyPoints": ["team leadership", "scalability expertise"]
  }' | json_pp
echo ""
echo "---"
echo ""

# Test 4: Interview Questions
echo "4. Testing Interview Questions Generator..."
curl -X POST "$BASE_URL/generate-interview-questions" \
  -H "Content-Type: application/json" \
  -d '{
    "jobDescription": "Looking for a Full Stack Developer with experience in React, Node.js, PostgreSQL, and AWS. Must have strong problem-solving skills.",
    "jobTitle": "Full Stack Developer",
    "companyName": "StartupXYZ"
  }' | json_pp
echo ""
echo "---"
echo ""

echo "All tests completed!"
