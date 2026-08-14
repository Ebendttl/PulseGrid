"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSelectedCategory, setComposerOpen } from "@/store/notificationsSlice";
import { apiClient } from "@/lib/apiClient";
import { Announcement, AnnouncementCategory } from "@/types/domain";
import { formatDate } from "@/lib/formatters";
import { toast } from "sonner";
import {
  Bell,
  Plus,
  Pin,
  Calendar,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Megaphone,
} from "lucide-react";

const composerSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Announcement content must be at least 10 characters"),
  category: z.enum(["academic", "events", "general"]),
  pinned: z.boolean().optional(),
});

type ComposerFormData = z.infer<typeof composerSchema>;

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { user, role } = useAppSelector((state) => state.auth);
  const { selectedCategory, composerOpen } = useAppSelector((state) => state.notifications);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Auto-refresh via TanStack Query background refetch (30s interval) hooked into document visibility state per Section 7.5
  const { data: announcements = [], isLoading } = useQuery<Announcement[]>({
    queryKey: ["announcements"],
    queryFn: async () => (await apiClient.get("/announcements")).data,
    refetchInterval: 30000,
    refetchIntervalInBackground: false, // Pauses when tab is backgrounded
  });

  const filteredAnnouncements = announcements.filter((a) => {
    if (selectedCategory === "all") return true;
    return a.category === selectedCategory;
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ComposerFormData>({
    resolver: zodResolver(composerSchema),
    defaultValues: {
      category: "academic",
      pinned: false,
    },
  });

  const postMutation = useMutation({
    mutationFn: async (data: ComposerFormData) => {
      const newNotice: Partial<Announcement> = {
        title: data.title,
        content: data.content,
        category: data.category,
        author: user?.name || "System Administrator",
        authorRole: role,
        createdAt: new Date().toISOString(),
        pinned: data.pinned || false,
      };
      await apiClient.post("/announcements", newNotice);
    },
    onSuccess: () => {
      toast.success("Announcement published successfully.");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      dispatch(setComposerOpen(false));
      reset();
    },
    onError: () => {
      toast.error("Failed to publish announcement.");
    },
  });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-pg-line pb-4">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-pg-ink">
              Digital Noticeboard
            </h1>
            <p className="text-xs text-pg-muted">
              Campus announcements, academic updates, and event notifications.
            </p>
          </div>

          {/* Role-gated Composer Button */}
          {(role === "admin" || role === "teacher") && (
            <Button
              onClick={() => dispatch(setComposerOpen(true))}
              className="gap-2 self-start sm:self-auto text-xs min-h-[44px]"
            >
              <Plus className="h-4 w-4" />
              <span>Post Announcement</span>
            </Button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {(["all", "academic", "events", "general"] as const).map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => dispatch(setSelectedCategory(cat))}
              className="capitalize text-xs min-h-[36px]"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Announcements Feed */}
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-xs text-pg-muted py-6 text-center">Loading noticeboard...</p>
          ) : filteredAnnouncements.length === 0 ? (
            /* Edge Case 1: Empty feed state */
            <Card className="p-8 text-center space-y-2 shadow-flat">
              <Megaphone className="h-8 w-8 text-pg-muted mx-auto" />
              <h3 className="text-sm font-semibold text-pg-ink">No announcements in this category</h3>
              <p className="text-xs text-pg-muted">Check back later for recent notice updates.</p>
            </Card>
          ) : (
            filteredAnnouncements.map((notice) => {
              const isExpanded = expandedIds.has(notice.id);
              const isLongText = notice.content.length > 180;

              return (
                <Card
                  key={notice.id}
                  className={`shadow-flat transition-all ${
                    notice.pinned ? "border-l-4 border-l-pg-signal-blue" : ""
                  }`}
                >
                  <CardHeader className="pb-2 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {notice.pinned && (
                          <Pin className="h-3.5 w-3.5 text-pg-signal-blue shrink-0" />
                        )}
                        <CardTitle className="text-base">{notice.title}</CardTitle>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-pg-muted font-mono-tabular">
                        <span>By {notice.author} ({notice.authorRole.toUpperCase()})</span>
                        <span>&bull;</span>
                        <span>{formatDate(notice.createdAt)}</span>
                      </div>
                    </div>

                    <Badge variant="outline" className="capitalize text-[10px] self-start">
                      {notice.category}
                    </Badge>
                  </CardHeader>

                  <CardContent className="pt-2 space-y-2">
                    {/* Edge Case 2: Truncate long text with Read More toggle */}
                    <p className="text-xs text-pg-ink leading-relaxed">
                      {isLongText && !isExpanded
                        ? `${notice.content.substring(0, 180)}...`
                        : notice.content}
                    </p>

                    {isLongText && (
                      <button
                        onClick={() => toggleExpand(notice.id)}
                        className="text-xs font-semibold text-pg-signal-blue flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <span>{isExpanded ? "Show Less" : "Read More"}</span>
                        {isExpanded ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )}
                      </button>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Role-gated Notice Composer Dialog */}
        <Dialog open={composerOpen} onOpenChange={(open) => dispatch(setComposerOpen(open))}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-pg-signal-blue" />
                <span>Post New Announcement</span>
              </DialogTitle>
              <DialogDescription>
                Publish a system announcement to all students and staff.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit((data) => postMutation.mutate(data))} className="space-y-4 py-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-pg-ink">Headline Title</label>
                <Input {...register("title")} placeholder="e.g. Midterm Schedule Update" />
                {errors.title && (
                  <p className="text-xs text-pg-risk-red">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-pg-ink">Category</label>
                <select
                  {...register("category")}
                  className="h-11 w-full rounded-[6px] border border-pg-line bg-pg-surface px-3 py-2 text-xs font-semibold text-pg-ink focus:outline-none focus:ring-2 focus:ring-pg-signal-blue"
                >
                  <option value="academic">Academic</option>
                  <option value="events">Events</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-pg-ink">Body Copy</label>
                <textarea
                  {...register("content")}
                  rows={4}
                  className="w-full rounded-[6px] border border-pg-line bg-pg-surface p-3 text-xs text-pg-ink focus:outline-none focus:ring-2 focus:ring-pg-signal-blue"
                  placeholder="Provide complete announcement details..."
                />
                {errors.content && (
                  <p className="text-xs text-pg-risk-red">{errors.content.message}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinned-check"
                  {...register("pinned")}
                  className="h-4 w-4 rounded border-pg-line text-pg-signal-blue"
                />
                <label htmlFor="pinned-check" className="text-xs font-medium text-pg-ink cursor-pointer">
                  Pin to top of noticeboard
                </label>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => dispatch(setComposerOpen(false))}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={postMutation.isPending}>
                  {postMutation.isPending ? "Publishing..." : "Publish Notice"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
