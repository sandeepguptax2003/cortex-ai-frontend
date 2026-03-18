"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api/client";
import { FadeIn } from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { useToast } from "@/components/ui/Toast";
import {
  Mic,
  MicOff,
  Play,
  Square,
  Clock,
  Calendar,
  Video,
  Sparkles,
  Loader2,
  Upload,
  FileText,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { formatDate, formatDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function MeetingsPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [activeMeetingId, setActiveMeetingId] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [transcriptDialogOpen, setTranscriptDialogOpen] = useState(false);
  const [transcriptTitle, setTranscriptTitle] = useState("");
  const [transcriptContent, setTranscriptContent] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch meetings
  const { data: meetingsData, isLoading } = useQuery({
    queryKey: ["meetings"],
    queryFn: () => api.getMeetings(),
  });

  // Fetch active meeting
  const { data: activeMeetingData } = useQuery({
    queryKey: ["activeMeeting"],
    queryFn: () => api.getActiveMeeting(),
    refetchInterval: isRecording ? 5000 : false,
  });

  const meetings = meetingsData?.data?.meetings || [];
  const activeMeeting = activeMeetingData?.data?.meeting;

  // Start meeting mutation
  const startMeetingMutation = useMutation({
    mutationFn: (title?: string) => api.startMeeting(title),
    onSuccess: (data) => {
      setActiveMeetingId(data.data.meeting.meetingId);
      setIsRecording(true);
      setElapsedTime(0);
      queryClient.invalidateQueries({ queryKey: ["activeMeeting"] });
      toast({
        variant: "success",
        title: "Meeting started",
        description: "Recording is now active.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "error",
        title: "Error",
        description: error.message || "Failed to start meeting",
      });
    },
  });

  // End meeting mutation
  const endMeetingMutation = useMutation({
    mutationFn: (meetingId: string) => api.endMeeting(meetingId),
    onSuccess: (data) => {
      setIsRecording(false);
      setActiveMeetingId(null);
      setElapsedTime(0);
      if (timerRef.current) clearInterval(timerRef.current);
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast({
        variant: "success",
        title: "Meeting ended",
        description: `${data.data.meeting.extractedTasks?.length || 0} tasks extracted.`,
      });
    },
    onError: (error: any) => {
      toast({
        variant: "error",
        title: "Error",
        description: error.message || "Failed to end meeting",
      });
    },
  });

  // Upload transcript mutation
  const uploadTranscriptMutation = useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      api.uploadTranscript(data),
    onSuccess: (data) => {
      setTranscriptDialogOpen(false);
      setTranscriptTitle("");
      setTranscriptContent("");
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast({
        variant: "success",
        title: "Transcript processed",
        description: `${data.data.extractedTasks?.length || 0} tasks extracted from transcript.`,
      });
    },
    onError: (error: any) => {
      toast({
        variant: "error",
        title: "Error",
        description: error.message || "Failed to process transcript",
      });
    },
  });

  // Timer effect
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const handleStartMeeting = () => {
    startMeetingMutation.mutate(meetingTitle || undefined);
  };

  const handleEndMeeting = () => {
    if (activeMeetingId) {
      endMeetingMutation.mutate(activeMeetingId);
    }
  };

  const handleUploadTranscript = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcriptTitle.trim() || !transcriptContent.trim()) {
      toast({
        variant: "error",
        title: "Missing fields",
        description: "Please provide both title and transcript content.",
      });
      return;
    }
    uploadTranscriptMutation.mutate({
      title: transcriptTitle,
      content: transcriptContent,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-green-100 text-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
            Live
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="outline" className="text-slate-600">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <FadeIn direction="down">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Meetings</h1>
            <p className="text-slate-500">Record meetings and extract tasks</p>
          </div>
          <div className="flex gap-3">
            <Dialog open={transcriptDialogOpen} onOpenChange={setTranscriptDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Transcript
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Upload Meeting Transcript</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUploadTranscript} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="transcriptTitle">Meeting Title</Label>
                    <Input
                      id="transcriptTitle"
                      value={transcriptTitle}
                      onChange={(e) => setTranscriptTitle(e.target.value)}
                      placeholder="e.g., Sprint Planning Meeting"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transcriptContent">Transcript Content</Label>
                    <Textarea
                      id="transcriptContent"
                      value={transcriptContent}
                      onChange={(e) => setTranscriptContent(e.target.value)}
                      placeholder="Paste your meeting transcript here..."
                      rows={10}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    isLoading={uploadTranscriptMutation.isPending}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Extract Tasks with AI
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            {!isRecording ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="btn-shine">
                    <Video className="w-4 h-4 mr-2" />
                    Start Meeting
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Start New Meeting</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Meeting Title (Optional)</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Sprint Planning"
                        value={meetingTitle}
                        onChange={(e) => setMeetingTitle(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={handleStartMeeting}
                      className="w-full"
                      isLoading={startMeetingMutation.isPending}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Recording
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Button variant="destructive" onClick={handleEndMeeting}>
                <Square className="w-4 h-4 mr-2" />
                End Meeting
              </Button>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Active Meeting Card */}
      {isRecording && (
        <FadeIn direction="up">
          <Card className="mb-6 p-6 border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                    <Mic className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {activeMeeting?.title || meetingTitle || "Active Meeting"}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDuration(elapsedTime)}
                    </span>
                    <span className="flex items-center gap-1 text-violet-600">
                      <Sparkles className="w-4 h-4" />
                      AI is listening...
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Tasks Extracted</p>
                <p className="text-3xl font-bold text-violet-600">
                  {activeMeeting?.extractedTasks?.length || 0}
                </p>
              </div>
            </div>
          </Card>
        </FadeIn>
      )}

      {/* Chrome Extension CTA */}
      {!isRecording && (
        <FadeIn direction="up" delay={100}>
          <Card className="mb-6 p-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-violet-600 flex items-center justify-center">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Chrome Extension Available</h3>
                  <p className="text-sm text-slate-500">
                    Automatically capture captions from Zoom, Google Meet, and Teams
                  </p>
                </div>
              </div>
              <Button
                className="btn-shine"
                onClick={() => {
                  toast({
                    variant: "info",
                    title: "Install Chrome Extension",
                    description:
                      "Open chrome://extensions, enable Developer Mode, then click 'Load unpacked' and select the Cortex-Chrome-Extension folder.",
                  });
                }}
              >
                Install Extension
              </Button>
            </div>
          </Card>
        </FadeIn>
      )}

      {/* Meetings List */}
      <FadeIn direction="up" delay={200}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-violet-600" />
            <h3 className="font-semibold">Past Meetings</h3>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
            </div>
          ) : meetings.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No meetings yet</h3>
              <p>Start your first meeting to extract tasks automatically</p>
            </div>
          ) : (
            <div className="space-y-4">
              {meetings.map((meeting: any) => (
                <div
                  key={meeting.meetingId}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <Video className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {meeting.title || "Untitled Meeting"}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(meeting.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(meeting.duration || 0)}
                        </span>
                        <span className="flex items-center gap-1 text-violet-600">
                          <Sparkles className="w-3 h-3" />
                          {meeting.extractedTasks?.length || 0} tasks
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(meeting.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </FadeIn>
    </DashboardLayout>
  );
}
