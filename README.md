# AI Code Review Assistant

A portfolio-quality developer tool that provides automated, multi-language AI code reviews powered by Google Gemini and MongoDB.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Monaco Editor, Axios, Lucide React
- **Backend:** Node.js, Express, Mongoose, REST API
- **Database:** MongoDB Atlas
- **AI Engine:** Google Gemini Flash API (`@google/genai`)

## Project Structure
```
ai-code-review/
├── client/     # React + Vite frontend
├── server/     # Node.js + Express backend
└── README.md
```

## Quick Start (Development)

### 1. Backend Setup
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### 2. Frontend Setup
```bash
cd client
cp .env.example .env
npm install
npm run dev
```
