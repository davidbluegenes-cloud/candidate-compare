# Candidate Compare

Candidate Compare is a web application prototype designed to make political candidate information easier to review side by side.

Instead of requiring users to already know which candidate they want to research, the application begins with an election and presents competing candidates together in a consistent comparison format.

## Current Prototype

The current version demonstrates a Florida U.S. Senate race and provides:

- Side-by-side candidate comparison
- Candidate issue positions
- Campaign proposals
- Relevant voting or public-service records
- Context for political claims and legislative actions
- Source information
- Campaign finance information
- Supabase cloud database
- Administrator authentication
- Full CRUD database functionality

## Evidence-First Design

Candidate Compare separates different kinds of political information rather than combining everything into a single score.

The application distinguishes between:

- Current stated positions
- Campaign proposals
- Voting or public-service records
- Important legislative context
- Campaign finance information
- Original sources

The goal is to organize evidence clearly so users can evaluate candidates themselves.

## Technologies Used

- React
- Vite
- JavaScript
- CSS
- Supabase
- PostgreSQL
- Supabase Authentication
- Git
- GitHub
- Netlify

## Database

Supabase provides the PostgreSQL database and Data API.

The current prototype uses three primary tables:

- candidates
- positions
- finance

Row Level Security is enabled.

Public visitors can read candidate information, while database modification requires authenticated access.

## CRUD Functionality

The Admin section demonstrates all four CRUD operations.

### Create
Administrators can create a new candidate issue record.

### Read
Candidate and issue records are retrieved from Supabase and displayed by the React frontend.

### Update
Existing issue records can be edited through the Admin interface.

### Delete
Administrators can remove database records.

## Technologies Used

- React
- Vite
- JavaScript
- CSS
- Supabase
- PostgreSQL
- Supabase Authentication
- Git
- GitHub
- Netlify

## Database

Supabase provides the PostgreSQL database and Data API.

The current prototype uses three primary tables:

- candidates
- positions
- finance

Row Level Security is enabled.

Public visitors can read candidate information, while database modification requires authenticated access.

## CRUD Functionality

The Admin section demonstrates all four CRUD operations.

### Create
Administrators can create a new candidate issue record.

### Read
Candidate and issue records are retrieved from Supabase and displayed by the React frontend.

### Update
Existing issue records can be edited through the Admin interface.

### Delete
Administrators can remove database records.

## Local Setup

1. Clone the repository.
2. Run npm install.
3. Create a .env.local file containing:

   VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
   VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY

4. Start the development server with npm run dev.

## Deployment

The application is deployed using Netlify.

Deployed application:
https://amazing-selkie-7721a5.netlify.app

## Demo Video

Demo video:
DEMO_VIDEO_URL

## Academic Project

This application was created as an Engineering Design 2 AI-assisted software development assignment.

The prototype demonstrates how AI tools can help design, build, troubleshoot, and deploy a functional database-backed web application.

Candidate Compare does not endorse political candidates.
