"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api/client";
import { FadeIn } from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  MoreHorizontal,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from "lucide-react";
import {
  getPriorityColor,
  getStatusColor,
  formatDate,
  getInitials,
  getDeadlineColor,
} from "@/lib/utils";
import { cn } from "@/lib/utils";

const columns = [
  { id: "BACKLOG", label: "Backlog", color: "bg-slate-100 dark:bg-slate-800/60" },
  { id: "ACTIVE", label: "To Do", color: "bg-blue-50 dark:bg-blue-950/30" },
  { id: "IN_PROGRESS", label: "In Progress", color: "bg-amber-50 dark:bg-amber-950/30" },
  { id: "IN_REVIEW", label: "In Review", color: "bg-purple-50 dark:bg-purple-950/30" },
  { id: "DONE", label: "Done", color: "bg-green-50 dark:bg-green-950/30" },
];

const priorities = [
  { value: "URGENT", label: "Urgent", color: "text-red-600" },
  { value: "HIGH", label: "High", color: "text-orange-600" },
  { value: "MEDIUM", label: "Medium", color: "text-yellow-600" },
  { value: "LOW", label: "Low", color: "text-green-600" },
];

export default function BoardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [draggedTicket, setDraggedTicket] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tickets
  const { data: ticketsData, isLoading } = useQuery({
    queryKey: ["tickets"],
    queryFn: () => api.getTickets(),
  });

  // Fetch team members for assignee selection
  const { data: membersData } = useQuery({
    queryKey: ["teamMembers"],
    queryFn: () => api.getTeamMembers(),
  });

  const tickets = ticketsData?.data?.tickets || [];
  const members = membersData?.data?.members || [];

  // Create ticket mutation
  const createTicketMutation = useMutation({
    mutationFn: (data: Parameters<typeof api.createTicket>[0]) => api.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      setIsCreateDialogOpen(false);
      toast({
        variant: "success",
        title: "Ticket created",
        description: "Your ticket has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "error",
        title: "Error",
        description: error.message || "Failed to create ticket",
      });
    },
  });

  // Update ticket mutation
  const updateTicketMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.updateTicket(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });

  // Filter tickets
  const filteredTickets = tickets.filter((ticket: any) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority =
      filterPriority === "all" || ticket.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  // Group tickets by status
  const ticketsByColumn = columns.reduce((acc: any, column) => {
    acc[column.id] = filteredTickets.filter(
      (t: any) => t.status === column.id
    );
    return acc;
  }, {});

  // Drag and drop handlers
  const handleDragStart = (ticket: any) => {
    setDraggedTicket(ticket);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (draggedTicket && draggedTicket.status !== status) {
      updateTicketMutation.mutate({
        id: draggedTicket.ticketId,
        data: { status },
      });
    }
    setDraggedTicket(null);
  };

  // Create ticket form
  const handleCreateTicket = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createTicketMutation.mutate({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      priority: formData.get("priority") as string,
      assigneeId: formData.get("assigneeId") as string,
      deadline: formData.get("deadline") as string,
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <FadeIn direction="down">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Board</h1>
            <p className="text-slate-500">Manage and track your tasks</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>

            {/* Priority Filter */}
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-40 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {priorities.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Create Button */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Ticket
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Ticket</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateTicket} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter ticket title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Enter description"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select name="priority" defaultValue="MEDIUM">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map((p) => (
                            <SelectItem key={p.value} value={p.value}>
                              {p.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Deadline</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                          id="deadline" 
                          name="deadline" 
                          type="datetime-local"
                          className="pl-9 dark:text-white dark:[color-scheme:dark]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assigneeId">Assignee</Label>
                    <Select name="assigneeId">
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member: any) => (
                          <SelectItem key={member.userId} value={member.userId}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    isLoading={createTicketMutation.isPending}
                  >
                    Create Ticket
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </FadeIn>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className={cn(
              "flex-shrink-0 w-80 rounded-xl p-4",
              column.color
            )}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{column.label}</h3>
                <Badge variant="secondary" className="text-xs bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {ticketsByColumn[column.id]?.length || 0}
                </Badge>
              </div>
            </div>

            {/* Tickets */}
            <div className="space-y-3 min-h-[200px]">
              {ticketsByColumn[column.id]?.map((ticket: any) => (
                <div
                  key={ticket.ticketId}
                  draggable
                  onDragStart={() => handleDragStart(ticket)}
                  className={cn(
                    "bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm cursor-move hover:shadow-md transition-shadow",
                    draggedTicket?.ticketId === ticket.ticketId && "opacity-50"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      className={cn("text-xs", getPriorityColor(ticket.priority))}
                      variant="outline"
                    >
                      {ticket.priority}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      #{ticket.ticketId.slice(-6)}
                    </span>
                  </div>
                  <h4 className="font-medium mb-2 line-clamp-2">{ticket.title}</h4>
                  {ticket.description && (
                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                      {ticket.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {ticket.assigneeName ? (
                        <div className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center text-xs font-medium text-violet-600">
                          {getInitials(ticket.assigneeName)}
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                          <User className="w-3 h-3 text-slate-400" />
                        </div>
                      )}
                      {ticket.deadline && (
                        <div
                          className={cn(
                            "flex items-center gap-1 text-xs",
                            getDeadlineColor(ticket.deadline)
                          )}
                        >
                          <Clock className="w-3 h-3" />
                          {formatDate(ticket.deadline)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
