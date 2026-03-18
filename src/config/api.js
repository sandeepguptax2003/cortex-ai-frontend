// Central API Configuration
// Change this URL to switch between environments

const API_CONFIG = {
  // Development
  development: {
    baseURL: "http://localhost:5572",
    wsURL: "ws://localhost:5572",
  },
  // Production (AWS)
  production: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://hvma0g3wqf.execute-api.ap-south-1.amazonaws.com/prod",
    wsURL: process.env.NEXT_PUBLIC_WS_URL || "wss://p13e17k7ka.execute-api.ap-south-1.amazonaws.com/prod",
  },
};

// Current environment - change this to switch
const ENV = process.env.NODE_ENV === "production" ? "production" : "development";

// Export config
export const API_BASE_URL = API_CONFIG[ENV].baseURL;
export const WS_BASE_URL = API_CONFIG[ENV].wsURL;

// API Endpoints
export const ENDPOINTS = {
  // Auth
  AUTH: {
    SIGNUP: "/auth/user/signup",
    LOGIN: "/auth/user/login",
    PROFILE: "/auth/user/profile",
    PASSWORD: "/auth/user/password",
    PROFILE_PICTURE: "/auth/user/profile-picture",
    DELETE_ACCOUNT: "/auth/user/account",
  },
  // Tickets
  TICKETS: {
    BASE: "/user/tickets",
    MY: "/user/tickets/my",
    OVERDUE: "/user/tickets/overdue",
    BY_ID: (id) => `/user/tickets/${id}`,
    COMMENTS: (id) => `/user/tickets/${id}/comments`,
  },
  // Meetings
  MEETINGS: {
    BASE: "/user/meetings",
    ACTIVE: "/user/meetings/active",
    BY_ID: (id) => `/user/meetings/${id}`,
    START: "/user/meetings/start",
    END: (id) => `/user/meetings/${id}/end`,
    CAPTIONS: (id) => `/user/meetings/${id}/captions`,
  },
  // Transcripts
  TRANSCRIPTS: {
    BASE: "/user/transcripts",
  },
  // Organisation
  ORG: {
    BASE: "/admin/organisation",
    CREATE: "/admin/organisation",
  },
  // Team
  TEAM: {
    MEMBERS: "/admin/members",
    STATS: "/admin/members/stats",
    ROLE: (id) => `/admin/members/${id}/role`,
    REMOVE: (id) => `/admin/members/${id}`,
  },
  // Invites
  INVITES: {
    BASE: "/admin/invites",
    VALIDATE: "/admin/invite/validate",
    JOIN: "/admin/join",
    REVOKE: (token) => `/admin/invites/${token}`,
  },
  // Analytics
  ANALYTICS: {
    DASHBOARD: "/admin/analytics/dashboard",
    DETAILED: "/admin/analytics/detailed",
    TRENDS: "/admin/analytics/trends",
  },
  // Slack
  SLACK: {
    STATUS: "/integrations/slack/status",
    OAUTH: "/integrations/slack/oauth",
    DISCONNECT: "/integrations/slack/disconnect",
  },
  // Notifications
  NOTIFICATIONS: {
    BASE: "/user/notifications",
    READ: (id) => `/user/notifications/${id}/read`,
    READ_ALL: "/user/notifications/read-all",
  },
  // AI
  AI: {
    CHAT: "/ai/chat",
    GENERATE_TICKETS: "/ai/generate-tickets",
    SUMMARIZE: "/ai/summarize",
    COMMAND: "/ai/command",
  },
};

export default API_CONFIG;
