"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  MessageSquare,
  Shield,
  Trash2,
  UserCheck,
  UserX,
  Home,
  TrendingUp,
  Mail,
  MessageCircle,
  Heart,
  BarChart3,
  Settings,
  AlertCircle,
  Download,
  Archive,
  HeartHandshake,
  Building2,
  BookOpen,
  Bell,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelpRequestsTab, LocalServicesTab, WellbeingResourcesTab, AlertsTab } from "./AdminDashboardTabs";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
};

type RecentUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: string;
  createdAt: Date;
  isAdmin: boolean;
};

type RecentPost = {
  id: string;
  content: string;
  postType: string;
  createdAt: Date;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
};

type Group = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  isPrivate: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  interests: string[];
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  _count: {
    members: number;
    posts: number;
  };
};

type Message = {
  id: string;
  content: string;
  read: boolean;
  createdAt: Date;
  sender: {
    firstName: string;
    lastName: string;
    email: string;
  };
  receiver: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  post: {
    id: string;
    content: string;
  };
};

type UsersByType = {
  accountType: string;
  _count: number;
}[];

type Report = {
  id: string;
  reason: string;
  description: string | null;
  status: string;
  createdAt: Date;
  reviewedAt: Date | null;
  reporter: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  reported: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  reviewer: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
};

type HelpRequest = {
  id: string;
  title: string;
  description: string;
  type: string;
  urgency: string;
  status: string;
  createdAt: Date;
  requester: {
    firstName: string;
    lastName: string;
    email: string;
  };
  helper: {
    firstName: string;
    lastName: string;
  } | null;
};

type LocalService = {
  id: string;
  name: string;
  description: string;
  category: string;
  isVerified: boolean;
  createdAt: Date;
  createdBy: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

type WellbeingResource = {
  id: string;
  title: string;
  description: string;
  category: string;
  isPublished: boolean;
  createdAt: Date;
  createdBy: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

type Alert = {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  isActive: boolean;
  createdAt: Date;
  expiresAt: Date | null;
  createdBy: {
    firstName: string;
    lastName: string;
  };
};

export default function AdminDashboard({
  user,
  stats,
  recentUsers,
  recentPosts,
  groups,
  messages,
  comments,
  usersByType,
  reports,
  helpRequests,
  localServices,
  wellbeingResources,
  alerts,
}: {
  user: User;
  stats: {
    totalUsers: number;
    totalPosts: number;
    totalGroups: number;
    totalMessages: number;
    totalComments: number;
    totalLikes: number;
    totalHelpRequests: number;
    totalLocalServices: number;
    totalWellbeingResources: number;
    totalAlerts: number;
  };
  recentUsers: RecentUser[];
  recentPosts: RecentPost[];
  groups: Group[];
  messages: Message[];
  comments: Comment[];
  usersByType: UsersByType;
  reports: Report[];
  helpRequests: HelpRequest[];
  localServices: LocalService[];
  wellbeingResources: WellbeingResource[];
  alerts: Alert[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Group messages by user
  const messagesByUser = messages.reduce((acc, message) => {
    const senderId = message.sender.email;
    const receiverId = message.receiver.email;
    
    if (!acc[senderId]) acc[senderId] = { user: message.sender, messages: [] };
    if (!acc[receiverId]) acc[receiverId] = { user: message.receiver, messages: [] };
    
    acc[senderId].messages.push(message);
    if (senderId !== receiverId) {
      acc[receiverId].messages.push(message);
    }
    
    return acc;
  }, {} as Record<string, { user: { firstName: string; lastName: string; email: string }; messages: typeof messages }>);

  const userList = Object.keys(messagesByUser).map(email => ({
    email,
    name: `${messagesByUser[email].user.firstName} ${messagesByUser[email].user.lastName}`,
    count: messagesByUser[email].messages.length,
  }));

  const filteredMessages = selectedUser === "all" 
    ? messages 
    : messagesByUser[selectedUser]?.messages || [];

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      alert("Error deleting user");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}/toggle-admin`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdmin: !currentStatus }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to update admin status");
      }
    } catch (error) {
      alert("Error updating admin status");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to delete post");
      }
    } catch (error) {
      alert("Error deleting post");
    } finally {
      setLoading(false);
    }
  };

  const handleReportAction = async (reportId: string, action: "approve" | "deny") => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert(`Failed to ${action} report`);
      }
    } catch (error) {
      alert(`Error ${action}ing report`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm("Are you sure you want to delete this group?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/groups/${groupId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to delete group");
      }
    } catch (error) {
      alert("Error deleting group");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveGroup = async (groupId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/groups/${groupId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to approve group");
      }
    } catch (error) {
      alert("Error approving group");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectGroup = async (groupId: string) => {
    if (!confirm("Are you sure you want to reject this group?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/groups/${groupId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject" }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to reject group");
      }
    } catch (error) {
      alert("Error rejecting group");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to delete message");
      }
    } catch (error) {
      alert("Error deleting message");
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveMessage = async (messageId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/messages/${messageId}/archive`, {
        method: "PATCH",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to archive message");
      }
    } catch (error) {
      alert("Error archiving message");
    } finally {
      setLoading(false);
    }
  };

  const handleExportMessages = () => {
    const messagesToExport = selectedUser === "all" ? messages : filteredMessages;
    
    // Create CSV content
    const headers = ["Date", "Sender Name", "Sender Email", "Receiver Name", "Receiver Email", "Message Content", "Read Status"];
    const rows = messagesToExport.map(msg => [
      new Date(msg.createdAt).toLocaleString(),
      `${msg.sender.firstName} ${msg.sender.lastName}`,
      msg.sender.email,
      `${msg.receiver.firstName} ${msg.receiver.lastName}`,
      msg.receiver.email,
      `"${msg.content.replace(/"/g, '""')}"`, // Escape quotes in CSV
      msg.read ? "Read" : "Unread"
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `messages_${selectedUser}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to delete comment");
      }
    } catch (error) {
      alert("Error deleting comment");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyService = async (serviceId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/local-services/${serviceId}/verify`, {
        method: "PATCH",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to verify service");
      }
    } catch (error) {
      alert("Error verifying service");
    } finally {
      setLoading(false);
    }
  };

  const handlePublishResource = async (resourceId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/wellbeing-resources/${resourceId}/publish`, {
        method: "PATCH",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to publish resource");
      }
    } catch (error) {
      alert("Error publishing resource");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAlert = async (alertId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/alerts/${alertId}/toggle`, {
        method: "PATCH",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to toggle alert");
      }
    } catch (error) {
      alert("Error toggling alert");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHelpRequest = async (requestId: string) => {
    if (!confirm("Are you sure you want to delete this help request?")) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/help-requests/${requestId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to delete help request");
      }
    } catch (error) {
      alert("Error deleting help request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Shield className="h-6 w-6 text-accent" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/newsletter">
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Newsletter
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <Home className="mr-2 h-4 w-4" />
                Back to Platform
              </Button>
            </Link>
            <span className="text-sm text-muted-foreground">
              {user.firstName} {user.lastName}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPosts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGroups}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMessages}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalComments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLikes}</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Help Requests</CardTitle>
              <HeartHandshake className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalHelpRequests}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Local Services</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLocalServices}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wellbeing Resources</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWellbeingResources}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAlerts}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-10">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="help-requests">Help Requests</TabsTrigger>
            <TabsTrigger value="local-services">Services</TabsTrigger>
            <TabsTrigger value="wellbeing">Wellbeing</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage all platform users and their permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {u.firstName} {u.lastName}
                          </p>
                          {u.isAdmin && (
                            <Badge variant="default">
                              <Shield className="mr-1 h-3 w-3" />
                              Admin
                            </Badge>
                          )}
                          <Badge variant="outline">{u.accountType}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined: {mounted ? new Date(u.createdAt).toLocaleDateString() : '...'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleAdmin(u.id, u.isAdmin)}
                          disabled={loading || u.id === user.id}
                        >
                          {u.isAdmin ? (
                            <>
                              <UserX className="mr-2 h-4 w-4" />
                              Remove Admin
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Make Admin
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUser(u.id)}
                          disabled={loading || u.id === user.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Post Management</CardTitle>
                <CardDescription>Monitor and moderate all posts on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="rounded-lg border p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <p className="font-medium">
                            {post.user.firstName} {post.user.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">{post.user.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {mounted ? new Date(post.createdAt).toLocaleString() : '...'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{post.postType}</Badge>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeletePost(post.id)}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="mb-2 text-sm">{post.content}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>{post._count.likes} likes</span>
                        <span>{post._count.comments} comments</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="groups" className="space-y-4">
            {/* Pending Groups for Approval */}
            {groups.filter(g => g.status === "PENDING").length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pending Group Approvals</CardTitle>
                  <CardDescription>Review and approve new group creation requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {groups.filter(g => g.status === "PENDING").map((group) => (
                      <div
                        key={group.id}
                        className="rounded-lg border p-4"
                      >
                        <div className="mb-3 flex items-start justify-between">
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                              <p className="font-medium">{group.name}</p>
                              {group.isPrivate && <Badge variant="secondary">Private</Badge>}
                              <Badge variant="default">Pending Approval</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{group.description}</p>
                            <div className="mt-2 text-xs text-muted-foreground">
                              <p>Created by: {group.creator.firstName} {group.creator.lastName} ({group.creator.email})</p>
                              <p>Created: {mounted ? new Date(group.createdAt).toLocaleString() : '...'}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleApproveGroup(group.id)}
                              disabled={loading}
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectGroup(group.id)}
                              disabled={loading}
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Groups */}
            <Card>
              <CardHeader>
                <CardTitle>All Groups</CardTitle>
                <CardDescription>Manage all community groups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {groups.filter(g => g.status !== "PENDING").map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{group.name}</p>
                          {group.isPrivate && <Badge variant="secondary">Private</Badge>}
                          <Badge variant={group.status === "APPROVED" ? "default" : "destructive"}>
                            {group.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{group.description}</p>
                        <div className="mt-1 flex gap-4 text-xs text-muted-foreground">
                          <span>Creator: {group.creator.firstName} {group.creator.lastName}</span>
                          <span>{group._count.members} members</span>
                          <span>{group._count.posts} posts</span>
                          <span>Created: {mounted ? new Date(group.createdAt).toLocaleDateString() : '...'}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteGroup(group.id)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Message Management</CardTitle>
                <CardDescription>Monitor and moderate platform messages (content hidden for privacy)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Filter by User:</label>
                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select a user..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users ({messages.length} messages)</SelectItem>
                        {userList.map((user) => (
                          <SelectItem key={user.email} value={user.email}>
                            {user.name} ({user.count} messages)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleExportMessages}
                    disabled={filteredMessages.length === 0}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export to CSV
                  </Button>
                </div>
                <div className="space-y-3">
                  {filteredMessages.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      <Mail className="mx-auto mb-2 h-12 w-12 opacity-50" />
                      <p>No messages found</p>
                    </div>
                  ) : (
                    filteredMessages.map((message) => (
                      <div key={message.id} className="rounded-lg border p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">
                                {message.sender.firstName} {message.sender.lastName}
                              </p>
                              <span className="text-xs text-muted-foreground">→</span>
                              <p className="text-sm font-medium">
                                {message.receiver.firstName} {message.receiver.lastName}
                              </p>
                              {!message.read && <Badge variant="default">Unread</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {message.sender.email} → {message.receiver.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {mounted ? new Date(message.createdAt).toLocaleString() : '...'}
                            </p>
                            <p className="mt-2 text-xs italic text-muted-foreground">
                              [Message content hidden - export to CSV to view]
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleArchiveMessage(message.id)}
                              disabled={loading}
                              title="Archive message"
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteMessage(message.id)}
                              disabled={loading}
                              title="Delete message"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Comment Management</CardTitle>
                <CardDescription>Monitor and moderate all comments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="rounded-lg border p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">
                            {comment.user.firstName} {comment.user.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">{comment.user.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {mounted ? new Date(comment.createdAt).toLocaleString() : '...'}
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            On post: {comment.post.content.substring(0, 50)}...
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Reports</CardTitle>
                <CardDescription>Review and manage user reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      <AlertCircle className="mx-auto mb-2 h-12 w-12 opacity-50" />
                      <p>No reports to review</p>
                    </div>
                  ) : (
                    reports.map((report) => (
                      <div
                        key={report.id}
                        className="rounded-lg border p-4"
                      >
                        <div className="mb-3 flex items-start justify-between">
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                              <Badge
                                variant={
                                  report.status === "PENDING"
                                    ? "default"
                                    : report.status === "APPROVED"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {report.status}
                              </Badge>
                              <Badge variant="outline">{report.reason.replace(/_/g, " ")}</Badge>
                            </div>
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="font-medium">Reporter:</span>{" "}
                                {report.reporter.firstName} {report.reporter.lastName} ({report.reporter.email})
                              </p>
                              <p>
                                <span className="font-medium">Reported User:</span>{" "}
                                {report.reported.firstName} {report.reported.lastName} ({report.reported.email})
                              </p>
                              {report.description && (
                                <p className="mt-2">
                                  <span className="font-medium">Details:</span> {report.description}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                Submitted: {mounted ? new Date(report.createdAt).toLocaleString() : '...'}
                              </p>
                              {report.reviewedAt && report.reviewer && (
                                <p className="text-xs text-muted-foreground">
                                  Reviewed by {report.reviewer.firstName} {report.reviewer.lastName} on{" "}
                                  {mounted ? new Date(report.reviewedAt).toLocaleString() : '...'}
                                </p>
                              )}
                            </div>
                          </div>
                          {report.status === "PENDING" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReportAction(report.id, "approve")}
                                disabled={loading}
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                Approve & Ban
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReportAction(report.id, "deny")}
                                disabled={loading}
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                Deny
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                  <CardDescription>Users by account type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {usersByType.map((type) => (
                      <div key={type.accountType} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{type.accountType}</Badge>
                        </div>
                        <span className="text-2xl font-bold">{type._count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Activity</CardTitle>
                  <CardDescription>Engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Average posts per user</span>
                      <span className="text-lg font-bold">
                        {stats.totalUsers > 0 ? (stats.totalPosts / stats.totalUsers).toFixed(1) : 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Average comments per post</span>
                      <span className="text-lg font-bold">
                        {stats.totalPosts > 0 ? (stats.totalComments / stats.totalPosts).toFixed(1) : 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Average likes per post</span>
                      <span className="text-lg font-bold">
                        {stats.totalPosts > 0 ? (stats.totalLikes / stats.totalPosts).toFixed(1) : 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Average group members</span>
                      <span className="text-lg font-bold">
                        {stats.totalGroups > 0 ? (groups.reduce((sum, g) => sum + g._count.members, 0) / stats.totalGroups).toFixed(1) : 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest platform actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{recentUsers.length} new users recently</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{recentPosts.length} recent posts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{messages.length} recent messages</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <span>{comments.length} recent comments</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Health</CardTitle>
                  <CardDescription>System status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Groups</span>
                      <Badge variant="default">{groups.filter(g => g._count.members > 0).length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Unread Messages</span>
                      <Badge variant="secondary">{messages.filter(m => !m.read).length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Engagement</span>
                      <Badge variant="outline">{stats.totalLikes + stats.totalComments}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <HelpRequestsTab
            helpRequests={helpRequests}
            loading={loading}
            mounted={mounted}
            onDelete={handleDeleteHelpRequest}
          />

          <LocalServicesTab
            localServices={localServices}
            loading={loading}
            mounted={mounted}
            onVerify={handleVerifyService}
          />

          <WellbeingResourcesTab
            wellbeingResources={wellbeingResources}
            loading={loading}
            mounted={mounted}
            onPublish={handlePublishResource}
          />

          <AlertsTab
            alerts={alerts}
            loading={loading}
            mounted={mounted}
            onToggle={handleToggleAlert}
          />
        </Tabs>
      </main>
    </div>
  );
}
