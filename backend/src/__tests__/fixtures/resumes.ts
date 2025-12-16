export const SAMPLE_RESUME_TEXT = `
John Doe
Software Engineer

EXPERIENCE
Senior Developer at TechCorp (2020-2024)
- Built scalable microservices with Node.js and TypeScript
- Led team of 5 developers
- Improved performance by 40%

SKILLS
JavaScript, React, Node.js, PostgreSQL
`.trim();

export const SAMPLE_JOB_DESCRIPTION = `
Senior Full-Stack Engineer

Requirements:
- 5+ years experience with TypeScript
- React and Node.js expertise
- PostgreSQL or similar database
- Leadership experience preferred
`.trim();

export const createMockPdfBuffer = (): Buffer => {
  // Minimal PDF with text
  return Buffer.from(
    "%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(Test Resume) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000214 00000 n\ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n338\n%%EOF",
  );
};
