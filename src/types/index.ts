export type UserRole = "ADMIN" | "MANAGER" | "MEMBER";

export type TicketStatus =
  | "BACKLOG"
  | "ACTIVE"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "DONE"
  | "OVERDUE";

export type TicketPriority = "URGENT" | "HIGH" | "MEDIUM" | "LOW";

export interface User {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  orgId?: string;
  organisationId?: string;
  avatar?: string;
  profilePicture?: string;
  slackUserId?: string;
  isActive?: boolean;
  notificationPreferences?: Record<string, boolean>;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organisation {
  orgId: string;
  name: string;
  domain?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  ticketId: string;
  orgId: string;
  title: string;
  description?: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  coAssignees?: string[];
  reviewerId?: string;
  reviewerName?: string;
  deadline?: string;
  sourceType?: "MANUAL" | "MEETING" | "AI";
  meetingId?: string;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
  activities?: TicketActivity[];
}

export interface TicketActivity {
  activityId: string;
  ticketId: string;
  type: "CREATED" | "UPDATED" | "STATUS_CHANGED" | "ASSIGNED" | "COMMENT";
  userId: string;
  userName: string;
  userAvatar?: string;
  description: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}

export interface Meeting {
  meetingId: string;
  orgId: string;
  title?: string;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  createdBy: string;
  createdByName?: string;
  duration?: number;
  extractedTasks?: string[];
  transcript?: string;
  captions?: MeetingCaption[];
  createdAt: string;
  updatedAt: string;
  endedAt?: string;
}

export interface MeetingCaption {
  text: string;
  speaker?: string;
  timestamp: number;
}

export interface Invite {
  token: string;
  orgId: string;
  orgName?: string;
  createdBy: string;
  status: "PENDING" | "USED" | "REVOKED";
  requireDomain: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface TeamMember {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  profilePicture?: string;
  ticketCount: number;
  completedCount: number;
  overdueCount: number;
  createdAt: string;
}

export interface Notification {
  notificationId: string;
  userId: string;
  type: "TICKET_ASSIGNED" | "TICKET_UPDATED" | "MEETING_ENDED" | "REMINDER";
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
}

export interface AnalyticsData {
  ticketStats: {
    total: number;
    byStatus: Record<TicketStatus, number>;
    byPriority: Record<TicketPriority, number>;
    completionRate: number;
    avgResolutionTime: number;
  };
  meetingStats: {
    totalMeetings: number;
    totalTasksExtracted: number;
    avgTasksPerMeeting: number;
  };
  teamStats: {
    totalMembers: number;
    activeMembers: number;
  };
  memberStats: TeamMember[];
}

export interface SlackConnection {
  connected: boolean;
  workspaceName?: string;
  channelName?: string;
  botUserId?: string;
}

export interface AIChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface TranscriptUpload {
  transcriptId: string;
  orgId: string;
  title: string;
  content: string;
  extractedTasks: Ticket[];
  createdBy: string;
  createdAt: string;
}
