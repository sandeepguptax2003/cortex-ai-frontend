import axios, { AxiosInstance, AxiosError } from "axios";
import { API_BASE_URL, ENDPOINTS } from "@/config/api";

let _loggingOut = false;
export function setLoggingOut(val: boolean) { _loggingOut = val; }

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
      withCredentials: true,
    });

    // Attach stored access token as Bearer on every request.
    // Backend accepts both cookie and Authorization header (AuthMiddleware.js line 6).
    // This makes auth work even when cross-origin cookies are blocked.
    this.client.interceptors.request.use((config) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("cortex_at");
        if (token) {
          config.headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return config;
    });

    let isRefreshing = false;
    let failedQueue: Array<{ resolve: (v: any) => void; reject: (e: any) => void }> = [];

    const processQueue = (error: any, token: string | null) => {
      failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token);
      });
      failedQueue = [];
    };

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const status = error.response?.status;
        const data = error.response?.data as any;

        const apiMessage =
          data?.error?.message ||
          data?.message ||
          error.message ||
          "Something went wrong";

        // Try silent token refresh on 401 before giving up
        if (status === 401 && typeof window !== "undefined") {
          const reqUrl = error.config?.url ?? "";
          const isLogoutRequest = reqUrl.includes("/logout");
          const isRefreshRequest = reqUrl.includes("/refresh-token");
          const refreshToken = localStorage.getItem("cortex_rt");

          if (!isLogoutRequest && !isRefreshRequest && isRefreshing) {
            // Queue this request until the refresh completes
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then((token) => {
              error.config!.headers.set("Authorization", `Bearer ${token}`);
              return this.client(error.config!);
            });
          }

          if (!isLogoutRequest && !isRefreshRequest && refreshToken && !isRefreshing) {
            isRefreshing = true;

            try {
              const refreshResponse = await this.client.post(
                ENDPOINTS.AUTH.REFRESH_TOKEN,
                { refreshToken },
                { headers: { Authorization: undefined } }
              );
              const newAccessToken = refreshResponse.data?.data?.accessToken;
              if (newAccessToken) {
                localStorage.setItem("cortex_at", newAccessToken);
                processQueue(null, newAccessToken);
                isRefreshing = false;
                // Retry original request with new token
                const retryConfig = error.config!;
                retryConfig.headers.set("Authorization", `Bearer ${newAccessToken}`);
                return this.client(retryConfig);
              }
            } catch {
              processQueue(new Error("Session expired"), null);
              isRefreshing = false;
              localStorage.removeItem("cortex_at");
              localStorage.removeItem("cortex_rt");
              const publicPaths = ["/", "/login", "/signup", "/forgot-password"];
              const isPublicPath = publicPaths.some((p) => window.location.pathname === p);
              if (!isPublicPath && !_loggingOut) window.location.href = "/?session=expired";
            }
          } else if (!isLogoutRequest && !isRefreshRequest && !refreshToken) {
            // No refresh token at all — clear storage and redirect if on private page
            localStorage.removeItem("cortex_at");
            const publicPaths = ["/", "/login", "/signup", "/forgot-password"];
            const isPublicPath = publicPaths.some((p) => window.location.pathname === p);
            if (!isPublicPath && !_loggingOut) window.location.href = "/?session=expired";
          }
        }

        const enrichedError = new Error(apiMessage) as any;
        enrichedError.status = status;
        enrichedError.code = data?.error?.code;
        enrichedError.originalError = error;
        return Promise.reject(enrichedError);
      }
    );
  }

  async signup(data: {
    email: string;
    password: string;
    name: string;
    orgId?: string;
    inviteToken?: string;
  }) {
    const response = await this.client.post(ENDPOINTS.AUTH.SIGNUP, data);
    return response.data;
  }

  async login(data: { email: string; password: string }) {
    const response = await this.client.post(ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  }

  async logout() {
    const response = await this.client.post("/auth/user/logout");
    return response.data;
  }

  async getProfile() {
    const response = await this.client.get(ENDPOINTS.AUTH.PROFILE);
    return response.data;
  }

  async updateProfile(data: { name?: string; email?: string; slackUserId?: string }) {
    const response = await this.client.patch(ENDPOINTS.AUTH.PROFILE, data);
    return response.data;
  }

  async updatePassword(data: { currentPassword: string; newPassword: string }) {
    const response = await this.client.patch(ENDPOINTS.AUTH.PASSWORD, data);
    return response.data;
  }

  async uploadProfilePicture(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await this.client.post(ENDPOINTS.AUTH.PROFILE_PICTURE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async uploadAvatar(file: File) {
    return this.uploadProfilePicture(file);
  }

  async deleteAccount() {
    const response = await this.client.delete(ENDPOINTS.AUTH.DELETE_ACCOUNT);
    return response.data;
  }

  async getTickets(params?: {
    status?: string;
    assigneeId?: string;
    priority?: string;
  }) {
    const response = await this.client.get(ENDPOINTS.TICKETS.BASE, { params });
    return response.data;
  }

  async getMyTickets() {
    const response = await this.client.get(ENDPOINTS.TICKETS.MY);
    return response.data;
  }

  async getOverdueTickets() {
    const response = await this.client.get(ENDPOINTS.TICKETS.OVERDUE);
    return response.data;
  }

  async getTicket(ticketId: string) {
    const response = await this.client.get(ENDPOINTS.TICKETS.BY_ID(ticketId));
    return response.data;
  }

  async createTicket(data: {
    title: string;
    description?: string;
    assigneeId?: string;
    coAssignees?: string[];
    reviewerId?: string;
    priority?: string;
    deadline?: string;
    sourceType?: string;
  }) {
    const response = await this.client.post(ENDPOINTS.TICKETS.BASE, data);
    return response.data;
  }

  async updateTicket(ticketId: string, data: unknown) {
    const response = await this.client.patch(ENDPOINTS.TICKETS.BY_ID(ticketId), data);
    return response.data;
  }

  async deleteTicket(ticketId: string) {
    const response = await this.client.delete(ENDPOINTS.TICKETS.BY_ID(ticketId));
    return response.data;
  }

  async addTicketComment(ticketId: string, content: string) {
    const response = await this.client.post(ENDPOINTS.TICKETS.COMMENTS(ticketId), {
      content,
    });
    return response.data;
  }

  async getMeetings() {
    const response = await this.client.get(ENDPOINTS.MEETINGS.BASE);
    return response.data;
  }

  async getMeeting(meetingId: string) {
    const response = await this.client.get(ENDPOINTS.MEETINGS.BY_ID(meetingId));
    return response.data;
  }

  async getActiveMeeting() {
    const response = await this.client.get(ENDPOINTS.MEETINGS.ACTIVE);
    return response.data;
  }

  async startMeeting(title?: string) {
    const response = await this.client.post(ENDPOINTS.MEETINGS.START, { title });
    return response.data;
  }

  async endMeeting(meetingId: string) {
    const response = await this.client.post(ENDPOINTS.MEETINGS.END(meetingId));
    return response.data;
  }

  async sendCaptions(meetingId: string, data: { text: string; timestamp: number }) {
    const response = await this.client.post(
      ENDPOINTS.MEETINGS.CAPTIONS(meetingId),
      data
    );
    return response.data;
  }

  async uploadTranscript(data: {
    title: string;
    content: string;
  }) {
    const response = await this.client.post(ENDPOINTS.TRANSCRIPTS.BASE, data);
    return response.data;
  }

  async getTranscripts() {
    const response = await this.client.get(ENDPOINTS.TRANSCRIPTS.BASE);
    return response.data;
  }

  async getOrganisation() {
    const response = await this.client.get(ENDPOINTS.ORG.BASE);
    return response.data;
  }

  async updateOrganisation(data: { name?: string; domain?: string }) {
    const response = await this.client.patch(ENDPOINTS.ORG.BASE, data);
    return response.data;
  }

  async createInvite(requireDomain?: boolean, invitedRole?: string) {
    const response = await this.client.post(ENDPOINTS.INVITES.BASE, { requireDomain, invitedRole });
    return response.data;
  }

  async getInvites() {
    const response = await this.client.get(ENDPOINTS.INVITES.BASE);
    return response.data;
  }

  async revokeInvite(token: string) {
    const response = await this.client.delete(ENDPOINTS.INVITES.REVOKE(token));
    return response.data;
  }

  async createOrganisation(data: { name: string; domain?: string }) {
    const response = await this.client.post(ENDPOINTS.ORG.BASE, data);
    return response.data;
  }

  async validateInvite(token: string, orgId: string) {
    const response = await this.client.get(ENDPOINTS.INVITES.VALIDATE, {
      params: { token, orgId },
    });
    return response.data;
  }

  async joinOrganisation(data: {
    token: string;
    orgId: string;
    email: string;
    password: string;
    name: string;
  }) {
    const response = await this.client.post(ENDPOINTS.INVITES.JOIN, data);
    return response.data;
  }

  async getTeamMembers() {
    const response = await this.client.get(ENDPOINTS.TEAM.MEMBERS);
    return response.data;
  }

  async getTeamStats() {
    const response = await this.client.get(ENDPOINTS.TEAM.STATS);
    return response.data;
  }

  async updateMemberRole(userId: string, role: string) {
    const response = await this.client.patch(ENDPOINTS.TEAM.ROLE(userId), {
      role,
    });
    return response.data;
  }

  async removeTeamMember(userId: string) {
    const response = await this.client.delete(ENDPOINTS.TEAM.REMOVE(userId));
    return response.data;
  }

  async getDashboardAnalytics() {
    const response = await this.client.get(ENDPOINTS.ANALYTICS.DASHBOARD);
    return response.data;
  }

  async getDetailedAnalytics() {
    const response = await this.client.get(ENDPOINTS.ANALYTICS.DETAILED);
    return response.data;
  }

  async getTicketTrends(days?: number) {
    const response = await this.client.get(ENDPOINTS.ANALYTICS.TRENDS, {
      params: { days },
    });
    return response.data;
  }

  async getSlackStatus() {
    const response = await this.client.get(ENDPOINTS.SLACK.STATUS);
    return response.data;
  }

  async connectSlack(code: string, state: string) {
    const response = await this.client.post(ENDPOINTS.SLACK.OAUTH, {
      code,
      state,
    });
    return response.data;
  }

  async disconnectSlack() {
    const response = await this.client.delete(ENDPOINTS.SLACK.DISCONNECT);
    return response.data;
  }

  async getNotifications() {
    const response = await this.client.get(ENDPOINTS.NOTIFICATIONS.BASE);
    return response.data;
  }

  async markNotificationRead(notificationId: string) {
    const response = await this.client.patch(
      ENDPOINTS.NOTIFICATIONS.READ(notificationId)
    );
    return response.data;
  }

  async markAllNotificationsRead() {
    const response = await this.client.patch(ENDPOINTS.NOTIFICATIONS.READ_ALL);
    return response.data;
  }

  async sendAIChatMessage(message: string, context?: unknown) {
    const response = await this.client.post(ENDPOINTS.AI.CHAT, { message, context });
    return response.data;
  }

  async generateTicketsFromTranscript(transcript: string) {
    const response = await this.client.post(ENDPOINTS.AI.GENERATE_TICKETS, { transcript });
    return response.data;
  }

  async summarizeTranscript(transcript: string) {
    const response = await this.client.post(ENDPOINTS.AI.SUMMARIZE, { transcript });
    return response.data;
  }

  async sendAICommand(command: string) {
    const response = await this.client.post(ENDPOINTS.AI.COMMAND, { command });
    return response.data;
  }
}

export const api = new ApiClient();
export default api;
