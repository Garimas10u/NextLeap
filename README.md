# NextLeap 

**NextLeap** is an AI-powered career development platform that helps users advance their professional journey with personalized guidance, resume and cover letter generation, and adaptive interview preparation. The platform leverages industry insights and generative AI to deliver tailored content and actionable feedback.

## Features
- User registration and authentication
- Resume builder and analytics
- Skill assessment quizzes
- Career guidance and resources
- Dashboard to track progress
- Gamification to enhance engagement

- ```env
# Database connection URL
DATABASE_URL=your_database_connection_string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key
