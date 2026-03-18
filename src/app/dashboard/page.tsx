"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api/client";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  TrendingUp,
  Calendar,
  ArrowRight,
  Plus,
  Sparkles,
  Video,
} from "lucide-react";
import {
  getPriorityColor,
  getStatusColor,
  formatDate,
  getDeadlineColor,
} from "@/lib/utils";

export default function DashboardPage() {
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ["dashboardAnalytics"],
    queryFn: () => api.getDashboardAnalytics(),
    retry: false,
  });

  const { data: myTicketsData, isLoading: ticketsLoading } = useQuery({
    queryKey: ["myTickets"],
    queryFn: () => api.getMyTickets(),
    retry: false,
  });

  const { data: overdueData, isLoading: overdueLoading } = useQuery({
    queryKey: ["overdueTickets"],
    queryFn: () => api.getOverdueTickets(),
    retry: false,
  });

  const { data: meetingsData } = useQuery({
    queryKey: ["meetings"],
    queryFn: () => api.getMeetings(),
    retry: false,
  });

  const analytics = analyticsData?.data;
  const myTickets = myTicketsData?.data?.tickets?.slice(0, 5) || [];
  const overdueTickets = overdueData?.data?.tickets?.slice(0, 5) || [];
  const recentMeetings = meetingsData?.data?.meetings?.slice(0, 3) || [];

  const isLoading = analyticsLoading || ticketsLoading || overdueLoading;

  const stats = [
    {
      title: "Total Tickets",
      value: analytics?.ticketStats?.total || 0,
      icon: CheckCircle2,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "In Progress",
      value: analytics?.ticketStats?.byStatus?.IN_PROGRESS || 0,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
    {
      title: "Completed",
      value: analytics?.ticketStats?.byStatus?.DONE || 0,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Team Members",
      value: analytics?.teamStats?.totalMembers || 0,
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  const completionRate = analytics?.ticketStats?.total
    ? Math.round(
        ((analytics?.ticketStats?.byStatus?.DONE || 0) /
          analytics?.ticketStats?.total) *
          100
      )
    : 0;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <FadeIn direction="down">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400">
              Overview of your team&apos;s progress
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/meetings">
              <Button variant="outline" className="gap-2">
                <Video className="w-4 h-4" />
                Start Meeting
              </Button>
            </Link>
            <Link href="/board">
              <Button className="gap-2 btn-shine">
                <Plus className="w-4 h-4" />
                New Ticket
              </Button>
            </Link>
          </div>
        </div>
      </FadeIn>

      {/* Stats Grid */}
      <StaggerContainer staggerDelay={100} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
      </StaggerContainer>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Tickets */}
          <FadeIn direction="up" delay={200}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-violet-600" />
                  <h3 className="font-semibold">My Tickets</h3>
                </div>
                <Link href="/board">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {myTickets.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No tickets assigned to you</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myTickets.map((ticket: any) => (
                    <div
                      key={ticket.ticketId}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            className={getPriorityColor(ticket.priority)}
                            variant="outline"
                          >
                            {ticket.priority}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            #{ticket.ticketId.slice(-6)}
                          </span>
                        </div>
                        <p className="font-medium truncate">{ticket.title}</p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        {ticket.deadline && (
                          <div
                            className={`flex items-center gap-1 text-sm ${getDeadlineColor(
                              ticket.deadline
                            )}`}
                          >
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(ticket.deadline)}</span>
                          </div>
                        )}
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </FadeIn>

          {/* Recent Meetings */}
          <FadeIn direction="up" delay={300}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-violet-600" />
                  <h3 className="font-semibold">Recent Meetings</h3>
                </div>
                <Link href="/meetings">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {recentMeetings.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No meetings yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentMeetings.map((meeting: any) => (
                    <div
                      key={meeting.meetingId}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                          <Video className="w-5 h-5 text-violet-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {meeting.title || "Untitled Meeting"}
                          </p>
                          <p className="text-sm text-slate-500">
                            {formatDate(meeting.createdAt)} •{" "}
                            {meeting.extractedTasks?.length || 0} tasks extracted
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          meeting.status === "COMPLETED" ? "default" : "outline"
                        }
                      >
                        {meeting.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </FadeIn>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Completion Progress */}
          <FadeIn direction="up" delay={200}>
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-violet-600" />
                <h3 className="font-semibold">Completion Rate</h3>
              </div>
              <div className="text-center mb-4">
                <span className="text-4xl font-bold gradient-text">
                  {completionRate}%
                </span>
              </div>
              <Progress value={completionRate} className="h-2 mb-2" />
              <p className="text-sm text-slate-500 text-center">
                {analytics?.ticketStats?.byStatus?.DONE || 0} of{" "}
                {analytics?.ticketStats?.total || 0} tickets completed
              </p>
            </Card>
          </FadeIn>

          {/* Overdue Tickets */}
          <FadeIn direction="up" delay={300}>
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold">Overdue Tickets</h3>
              </div>

              {overdueTickets.length === 0 ? (
                <div className="text-center py-6 text-slate-500">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-500" />
                  <p className="text-sm">No overdue tickets!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {overdueTickets.map((ticket: any) => (
                    <div
                      key={ticket.ticketId}
                      className="p-3 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/20"
                    >
                      <p className="font-medium text-sm truncate">
                        {ticket.title}
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        Due: {formatDate(ticket.deadline)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </FadeIn>

          {/* Priority Distribution */}
          <FadeIn direction="up" delay={400}>
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-violet-600" />
                <h3 className="font-semibold">By Priority</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Urgent", key: "URGENT", color: "bg-red-500" },
                  { label: "High", key: "HIGH", color: "bg-orange-500" },
                  { label: "Medium", key: "MEDIUM", color: "bg-yellow-500" },
                  { label: "Low", key: "LOW", color: "bg-green-500" },
                ].map((priority) => {
                  const count =
                    analytics?.ticketStats?.byPriority?.[priority.key] || 0;
                  const total = analytics?.ticketStats?.total || 1;
                  const percentage = Math.round((count / total) * 100);
                  return (
                    <div key={priority.key} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${priority.color}`}
                          />
                          {priority.label}
                        </span>
                        <span className="text-slate-500">{count}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${priority.color} transition-all`}
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
      </div>
    </DashboardLayout>
  );
}
