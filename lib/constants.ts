import {
  BarChart3,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Sparkles,
} from "lucide-react";

import type { UserRole } from "@/lib/types";

export const roleLabel: Record<UserRole, string> = {
  viewer: "Viewer",
  author: "Author",
  admin: "Admin",
};

export const dashboardSections = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, helper: "See what needs attention today" },
  { id: "create", label: "Write", icon: Sparkles, helper: "Draft and publish a new article" },
  { id: "edit", label: "Posts", icon: FileText, helper: "Update articles already in the system" },
  { id: "comments", label: "Comments", icon: MessageSquare, helper: "Read and monitor reader feedback" },
  { id: "analytics", label: "Insights", icon: BarChart3, helper: "Track publishing and engagement health" },
  { id: "settings", label: "Settings", icon: Settings, helper: "Profile and workspace rules" },
];

export const gradientPresets = [
  "linear-gradient(135deg, rgba(79,70,229,0.92), rgba(56,189,248,0.78))",
  "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(14,165,233,0.72))",
  "linear-gradient(135deg, rgba(16,185,129,0.92), rgba(59,130,246,0.75))",
  "linear-gradient(135deg, rgba(244,114,182,0.9), rgba(251,191,36,0.8))",
  "linear-gradient(135deg, rgba(2,132,199,0.92), rgba(99,102,241,0.8))",
  "linear-gradient(135deg, rgba(30,41,59,0.96), rgba(168,85,247,0.74))",
];
