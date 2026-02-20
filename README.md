# Cortex AI - Frontend

AI-powered meeting assistant and task management platform built with Next.js 14.

## Tech Stack

- **Framework:** Next.js 14 (App Router, SSR)
- **Language:** TypeScript (strict mode)
- **Styling:** TailwindCSS 3.4
- **UI Components:** shadcn/ui (Radix primitives)
- **State Management:** TanStack Query (React Query) + React Context
- **Drag & Drop:** dnd-kit
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Date:** date-fns
- **WebSocket:** Native WebSocket API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

3. Copy environment variables:

```bash
cp .env.example .env.local
```

4. Update `.env.local` with your API URLs

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:

```bash
npm run build
```

### Type Check

Run TypeScript type checking:

```bash
npm run type-check
```

## Project Structure

```
cortex-ai-frontend/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── (dashboard)/       # Dashboard pages (board, meetings, analytics, settings)
│   └── join/              # Invite link landing page
├── auth/                  # Auth module (components, hooks, context)
├── user/                  # User module (board, meetings, profile)
├── manager/               # Manager module (analytics, team, settings)
├── shared/                # Shared components, hooks, lib, types
│   ├── components/        # UI components (shadcn/ui)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # API client, WebSocket, utilities
│   ├── types/             # TypeScript types and enums
│   └── config/            # Configuration files
└── public/                # Static assets
```

## Environment Variables

See `.env.example` for required environment variables.

## Deployment

This project is configured for deployment on AWS Amplify with auto-deploy from the main branch.

## License

Proprietary - All rights reserved

