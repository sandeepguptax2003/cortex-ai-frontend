# Cortex AI

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.0.3-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.7.2-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3.4.15-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-11.12.0-EF44B3?style=for-the-badge" alt="Framer Motion" />
</p>

<p align="center">
  <strong>Transform Meetings into Actionable Tasks with AI-Powered Decision Intelligence</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#api-documentation">API</a> •
  <a href="#deployment">Deployment</a>
</p>

---

> **Project Status:** Cortex AI was a live, fully deployed platform on AWS Amplify — [Semifinalist, AWS 10,000 AIdeas Competition 2025](https://builder.aws.com/content/3B84yzRMPmtfrqTZ1WpfN50Jitg/aideas-cortex-ai-the-ai-powered-meeting-intelligence-platform). The live deployment has since been taken offline as part of AWS cost/billing cleanup; the codebase below reflects the full, working dashboard. Companion repos: [Backend](https://github.com/sandeepguptax2003/Cortex-AI-Backend) · [Chrome Extension](https://github.com/sandeepguptax2003/Cortex-Chrome-Extension).

## 🎯 Overview

**Cortex AI** is a modern, AI-powered meeting task extraction and management platform. It automatically extracts actionable tasks from meetings, assigns owners, sets deadlines, and tracks progress — ensuring no action item ever gets missed.

### Key Capabilities

- 🤖 **AI Task Extraction**: Automatically extract tasks from meeting transcripts
- 📊 **Kanban Board**: Visual task management with drag-and-drop functionality
- 🎥 **Meeting Integration**: Works with Zoom, Google Meet, and Microsoft Teams
- 🔔 **Real-time Notifications**: WebSocket-powered live updates
- 📈 **Analytics Dashboard**: Track team productivity and task completion rates
- 💬 **AI Chatbot**: Built-in assistant for task management queries
- 🔗 **Slack Integration**: Connect your workspace for seamless notifications

---

## ✨ Features

### Core Features

| Feature | Description |
|---------|-------------|
| **AI-Powered Extraction** | Automatically identifies and extracts tasks from meeting transcripts |
| **Smart Assignment** | AI suggests task owners based on context and team roles |
| **Deadline Detection** | Automatically detects and sets deadlines from meeting discussions |
| **Kanban Board** | Visual task board with status columns (Backlog, Active, In Progress, In Review, Done) |
| **Meeting Management** | Start/stop meetings, capture live captions, upload transcripts |
| **Team Collaboration** | Invite team members, manage roles (Admin, Manager, Member) |
| **Real-time Updates** | WebSocket-based live notifications and ticket updates |

### Authentication & Security

- JWT-based authentication with access and refresh tokens
- Role-based access control (RBAC)
- Protected routes with middleware
- Session expiration handling
- Secure password management

### UI/UX Features

- 🌓 Dark/Light mode support
- 🎨 Premium design system with glassmorphism effects
- ✨ Smooth animations powered by Framer Motion
- 📱 Fully responsive design
- ♿ Accessibility compliant (ARIA labels, keyboard navigation)
- 🎯 Custom scrollbar styling
- 🌈 Gradient effects and glow animations

---

## 🛠️ Tech Stack

### Frontend Framework
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development

### Styling & UI
- **[Tailwind CSS 3](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI primitives
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide React](https://lucide.dev/)** - Icon library

### State Management & Data Fetching
- **[TanStack Query (React Query)](https://tanstack.com/query)** - Server state management
- **[React Context](https://react.dev/reference/react/useContext)** - Global state (Auth, Theme)
- **[Axios](https://axios-http.com/)** - HTTP client

### Backend Integration
- **REST API** - Full CRUD operations
- **WebSocket** - Real-time communication
- **JWT Authentication** - Secure token-based auth

### Development Tools
- **TypeScript 5.7** - Static type checking
- **PostCSS** - CSS processing
- **ESLint** - Code linting (disabled during builds)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cortex-ai-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   
   Update the environment variables:
   ```env
   # Local Development
   NEXT_PUBLIC_API_URL=http://localhost:8080
   NEXT_PUBLIC_WS_URL=ws://localhost:8080
   
   NEXT_PUBLIC_APP_NAME=Cortex AI
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   NEXT_PUBLIC_SLACK_CLIENT_ID=your-slack-client-id
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000`

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |

---

## 📁 Project Structure

```
cortex-ai-frontend/
├── public/                    # Static assets (images, fonts, icons)
│   ├── favicon.ico
│   ├── icon.svg
│   ├── apple-touch-icon.png
│   └── manifest.json
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── page.tsx           # Landing page (Home)
│   │   ├── layout.tsx         # Root layout with fonts & metadata
│   │   ├── globals.css        # Global styles & Tailwind directives
│   │   ├── providers.tsx      # App providers (Query, Auth, Theme, Toast)
│   │   │
│   │   ├── analytics/         # Analytics dashboard page
│   │   ├── board/             # Kanban board page
│   │   ├── dashboard/         # Main dashboard page
│   │   ├── login/             # Login page
│   │   ├── meetings/          # Meetings management page
│   │   ├── settings/          # User settings page
│   │   ├── signup/            # Signup page
│   │   └── team/              # Team management page
│   │
│   ├── components/            # React components
│   │   ├── animations/        # Animation components
│   │   │   ├── FadeIn.tsx
│   │   │   ├── GlowEffect.tsx
│   │   │   ├── HoverScale.tsx
│   │   │   ├── MagneticButton.tsx
│   │   │   ├── ParticleBackground.tsx
│   │   │   └── StaggerContainer.tsx
│   │   │
│   │   ├── chatbot/           # AI Chatbot component
│   │   │   └── AIChatbot.tsx
│   │   │
│   │   ├── dashboard/         # Dashboard-specific components
│   │   │   └── PageHeader.tsx
│   │   │
│   │   ├── layout/            # Layout components
│   │   │   └── DashboardLayout.tsx
│   │   │
│   │   ├── shared/            # Shared/reusable components
│   │   │   ├── AuthRedirect.tsx
│   │   │   ├── CreateOrgFlow.tsx
│   │   │   ├── Logo.tsx
│   │   │   ├── ProtectedLayout.tsx
│   │   │   ├── SEO.tsx
│   │   │   └── SessionExpiredToast.tsx
│   │   │
│   │   └── ui/                # UI primitive components
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── CortexLoader.tsx
│   │       ├── Dialog.tsx
│   │       ├── DropdownMenu.tsx
│   │       ├── Input.tsx
│   │       ├── Label.tsx
│   │       ├── Progress.tsx
│   │       ├── Select.tsx
│   │       ├── Switch.tsx
│   │       ├── Textarea.tsx
│   │       └── Toast.tsx
│   │
│   ├── config/                # Configuration files
│   │   └── api.js             # API endpoints & base URLs
│   │
│   ├── context/               # React Context providers
│   │   ├── AuthContext.tsx    # Authentication state
│   │   └── ThemeContext.tsx   # Dark/Light mode
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts         # Authentication hook
│   │   ├── useOrganisation.ts # Organization management
│   │   └── useWebSocket.ts    # WebSocket connection
│   │
│   ├── lib/                   # Utility libraries
│   │   ├── api/
│   │   │   └── client.ts      # API client with interceptors
│   │   ├── seo.ts             # SEO configuration
│   │   └── utils.ts           # Utility functions
│   │
│   ├── sections/              # Landing page sections
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Integrations.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Pricing.tsx
│   │   ├── FAQ.tsx
│   │   ├── CTA.tsx
│   │   └── Footer.tsx
│   │
│   ├── styles/                # Additional styles
│   │   └── theme.css          # Premium theme system
│   │
│   └── types/                 # TypeScript type definitions
│       └── index.ts           # All type definitions
│
├── .dockerignore              # Docker ignore rules
├── .env.example               # Example environment variables
├── .env.local                 # Local environment variables
├── .gitignore                 # Git ignore rules
├── Dockerfile                 # Docker configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies & scripts
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

---

## 🔌 API Documentation

### Base Configuration

The API client is configured in `src/lib/api/client.ts` with:
- Base URL from environment variables
- Request/Response interceptors
- Automatic token refresh on 401 errors
- Bearer token authentication

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/user/signup` | User registration |
| POST | `/auth/user/login` | User login |
| POST | `/auth/user/logout` | User logout |
| POST | `/auth/user/refresh-token` | Refresh access token |
| GET | `/auth/user/profile` | Get user profile |
| PATCH | `/auth/user/profile` | Update profile |
| PATCH | `/auth/user/password` | Change password |
| POST | `/auth/user/profile-picture` | Upload avatar |
| DELETE | `/auth/user/account` | Delete account |

### Ticket Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/tickets` | List all tickets |
| GET | `/user/tickets/my` | Get my tickets |
| GET | `/user/tickets/overdue` | Get overdue tickets |
| GET | `/user/tickets/:id` | Get ticket details |
| POST | `/user/tickets` | Create new ticket |
| PATCH | `/user/tickets/:id` | Update ticket |
| DELETE | `/user/tickets/:id` | Delete ticket |
| POST | `/user/tickets/:id/comments` | Add comment |

### Meeting Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/meetings` | List meetings |
| GET | `/user/meetings/active` | Get active meeting |
| GET | `/user/meetings/:id` | Get meeting details |
| POST | `/user/meetings/start` | Start new meeting |
| POST | `/user/meetings/:id/end` | End meeting |
| POST | `/user/meetings/:id/captions` | Send captions |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/organisation` | Get organization |
| POST | `/admin/organisation` | Create organization |
| PATCH | `/admin/organisation` | Update organization |
| GET | `/admin/members` | List team members |
| GET | `/admin/members/stats` | Get team stats |
| PATCH | `/admin/members/:id/role` | Update member role |
| DELETE | `/admin/members/:id` | Remove member |
| GET | `/admin/invites` | List invites |
| POST | `/admin/invites` | Create invite |
| DELETE | `/admin/invites/:token` | Revoke invite |

### AI Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai/chat` | AI chat message |
| POST | `/ai/generate-tickets` | Generate tickets from transcript |
| POST | `/ai/summarize` | Summarize transcript |
| POST | `/ai/command` | Send AI command |

---

## 🎨 Design System

### Colors

The project uses a premium violet-blue color palette:

```css
/* Primary Colors */
--color-primary-500: #8b5cf6;  /* Violet */
--color-primary-600: #7c3aed;  /* Primary */
--color-primary-700: #6d28d9;  /* Dark Violet */

/* Gradients */
--gradient-primary: linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #0ea5e9 100%);
--gradient-secondary: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
--gradient-accent: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
```

### Typography

- **Sans-serif**: Inter (body text, UI elements)
- **Display**: Playfair Display (headings)
- **Mono**: JetBrains Mono (code, timestamps)

### Spacing Scale

Uses a 0.25rem (4px) base unit:
- `space-1`: 0.25rem
- `space-4`: 1rem
- `space-8`: 2rem
- `space-16`: 4rem

### Shadows

```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-glow-primary: 0 0 20px rgba(124, 58, 237, 0.4);
```

---

## 🔐 Authentication Flow

1. **Login/Signup**: User submits credentials
2. **Token Storage**: Access token stored in `localStorage` (`cortex_at`)
3. **Refresh Token**: Stored in `localStorage` (`cortex_rt`)
4. **API Requests**: Token attached as Bearer header
5. **Token Refresh**: Automatic refresh on 401 errors
6. **Session Expiry**: Redirect to home with `?session=expired` query

---

## 🌐 WebSocket Integration

Real-time features use WebSocket connections:

```typescript
import { useWebSocket } from '@/hooks/useWebSocket';

const { isConnected, sendMessage } = useWebSocket({
  onMessage: (message) => {
    console.log('Received:', message);
  },
  onConnect: () => {
    console.log('Connected to WebSocket');
  },
});
```

### Available WebSocket Hooks

- `useWebSocket()` - Base WebSocket hook
- `useRealtimeNotifications()` - Notification updates
- `useRealtimeTickets()` - Ticket updates
- `useRealtimeCaptions()` - Live meeting captions

---

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t cortex-ai-frontend .
```

### Run Container

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.example.com \
  -e NEXT_PUBLIC_WS_URL=wss://api.example.com \
  cortex-ai-frontend
```

### Docker Compose Example

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8080
      - NEXT_PUBLIC_WS_URL=ws://backend:8080
```

---

## ☁️ Deployment

### AWS Amplify

1. Connect your GitHub repository to AWS Amplify
2. Set environment variables in the Amplify Console:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_WS_URL`
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_SLACK_CLIENT_ID`
3. Build settings are auto-detected from `next.config.ts`

> **Note**: Do NOT use `output: 'standalone'` with AWS Amplify. The configuration in `next.config.ts` is optimized for Amplify deployment.

### Vercel

```bash
npm i -g vercel
vercel --prod
```

### Self-Hosted

```bash
npm run build
npm run start
```

---

## 🧩 Component Usage Examples

### Button Component

```tsx
import { Button } from '@/components/ui/Button';

// Primary button
<Button>Click me</Button>

// Variants
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// With loading state
<Button isLoading>Loading...</Button>
```

### Animation Components

```tsx
import { FadeIn } from '@/components/animations/FadeIn';
import { StaggerContainer } from '@/components/animations/StaggerContainer';

// Fade in animation
<FadeIn direction="up" delay={100}>
  <h1>Hello World</h1>
</FadeIn>

// Staggered children
<StaggerContainer staggerDelay={100}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</StaggerContainer>
```

### Using TanStack Query

```tsx
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

function MyComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => api.getTickets(),
    staleTime: 60 * 1000, // 1 minute
  });

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return <TicketList tickets={data.data.tickets} />;
}
```

---

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes |
| `NEXT_PUBLIC_WS_URL` | WebSocket server URL | Yes |
| `NEXT_PUBLIC_APP_NAME` | Application name | No (default: Cortex AI) |
| `NEXT_PUBLIC_APP_URL` | Application base URL | Yes |
| `NEXT_PUBLIC_SLACK_CLIENT_ID` | Slack OAuth client ID | For Slack integration |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow existing component patterns
- Use Tailwind CSS for styling
- Add animations for interactive elements
- Ensure responsive design

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🆘 Support

For support, email support@cortex-ai.com or join our Slack community.

---

<p align="center">
  Built with ❤️ by the Cortex AI Team
</p>
