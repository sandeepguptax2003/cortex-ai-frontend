// For Production
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://rq6ypa7pyw.ap-south-1.awsapprunner.com";
export const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "wss://rq6ypa7pyw.ap-south-1.awsapprunner.com";

// For Development
// export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
// export const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";

// API Endpoints
export const ENDPOINTS = {
  // Auth
  AUTH: {
    SIGNUP: "/auth/user/signup",
    LOGIN: "/auth/user/login",
    LOGOUT: "/auth/user/logout",
    REFRESH_TOKEN: "/auth/user/refresh-token",
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
