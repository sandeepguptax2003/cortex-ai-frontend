"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api/client";
import { FadeIn } from "@/components/animations/FadeIn";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  Calendar,
  Target,
  Zap,
  Video,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { CortexLoader } from "@/components/ui/CortexLoader";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30");

  // Fetch analytics data
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["detailedAnalytics"],
    queryFn: () => api.getDetailedAnalytics(),
  });

  // Fetch ticket trends
  const { data: trendsData, isLoading: trendsLoading } = useQuery({
    queryKey: ["ticketTrends", timeRange],
    queryFn: () => api.getTicketTrends(parseInt(timeRange)),
  });

  const analytics = analyticsData?.data;
  const trends = trendsData?.data?.trends || [];

  const stats = [
    {
      title: "Total Tickets",
      value: analytics?.ticketStats?.total || 0,
      icon: CheckCircle2,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Completion Rate",
      value: `${analytics?.ticketStats?.completionRate || 0}%`,
      icon: Target,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Avg Resolution Time",
      value: `${analytics?.ticketStats?.avgResolutionTime || 0}h`,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
    {
      title: "Tasks from Meetings",
      value: analytics?.meetingStats?.totalTasksExtracted || 0,
      icon: Zap,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  if (isLoading) {
    return <CortexLoader variant="page" text="Loading analytics..." />;
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <FadeIn direction="down">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-slate-500 dark:text-slate-400">Insights into your team&apos;s performance</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FadeIn>

      {/* Stats Grid */}
      <FadeIn direction="up" delay={100}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.title}</p>
            </Card>
          ))}
        </div>
      </FadeIn>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Ticket Trends */}
        <FadeIn direction="up" delay={200}>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-violet-600" />
              <h3 className="font-semibold">Ticket Trends</h3>
            </div>
            {trendsLoading ? (
              <CortexLoader variant="inline" className="min-h-[150px]" text="Fetching trends..." />
            ) : trends.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No trend data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trends.slice(-7).map((day: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{formatDate(day.date)}</span>
                      <span className="font-medium">{day.count} tickets</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all"
                        style={{
                          width: `${
                            (day.count /
                              Math.max(...trends.map((t: any) => t.count))) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </FadeIn>

        {/* Status Distribution */}
        <FadeIn direction="up" delay={300}>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-violet-600" />
              <h3 className="font-semibold">Status Distribution</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: "Backlog", key: "BACKLOG", color: "bg-slate-400" },
                { label: "To Do", key: "ACTIVE", color: "bg-blue-500" },
                { label: "In Progress", key: "IN_PROGRESS", color: "bg-amber-500" },
                { label: "In Review", key: "IN_REVIEW", color: "bg-purple-500" },
                { label: "Done", key: "DONE", color: "bg-green-500" },
              ].map((status) => {
                const count =
                  analytics?.ticketStats?.byStatus?.[status.key] || 0;
                const total = analytics?.ticketStats?.total || 1;
                const percentage = Math.round((count / total) * 100);
                return (
                  <div key={status.key} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${status.color}`} />
                        {status.label}
                      </span>
                      <span className="text-slate-500">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${status.color} transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </FadeIn>
      </div>

      {/* Team Performance */}
      <FadeIn direction="up" delay={400}>
        <Card className="mb-6">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-600" />
              <h3 className="font-semibold">Team Performance</h3>
            </div>
          </div>
          <div className="p-6">
            {analytics?.memberStats?.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No team data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {analytics?.memberStats?.map((member: any) => (
                  <div
                    key={member.userId}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-medium">
                        {member.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-slate-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-violet-600">
                          {member.ticketCount}
                        </p>
                        <p className="text-xs text-slate-500">Tickets</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-500">
                          {member.completedCount}
                        </p>
                        <p className="text-xs text-slate-500">Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-amber-500">
                          {member.overdueCount}
                        </p>
                        <p className="text-xs text-slate-500">Overdue</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </FadeIn>

      {/* Meeting Stats */}
      <FadeIn direction="up" delay={500}>
        <Card>
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-violet-600" />
              <h3 className="font-semibold">Meeting Insights</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                <Video className="w-8 h-8 text-violet-600 mx-auto mb-3" />
                <p className="text-4xl font-bold gradient-text">
                  {analytics?.meetingStats?.totalMeetings || 0}
                </p>
                <p className="text-sm text-slate-500 mt-2">Total Meetings</p>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <p className="text-4xl font-bold gradient-text">
                  {analytics?.meetingStats?.totalTasksExtracted || 0}
                </p>
                <p className="text-sm text-slate-500 mt-2">Tasks Extracted</p>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                <Target className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <p className="text-4xl font-bold gradient-text">
                  {analytics?.meetingStats?.avgTasksPerMeeting || 0}
                </p>
                <p className="text-sm text-slate-500 mt-2">Avg Tasks/Meeting</p>
              </div>
            </div>
          </div>
        </Card>
      </FadeIn>
    </DashboardLayout>
  );
}
