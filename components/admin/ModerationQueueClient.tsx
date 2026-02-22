"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  EyeOff,
  Flag,
  Clock,
  User,
  Calendar,
  MessageSquare,
  Heart,
  ArrowLeft,
} from "lucide-react";
import PlatformHeader from "@/components/shared/PlatformHeader";

type AdminUser = {
  isAdmin: boolean;
  firstName: string;
  lastName: string;
  email: string;
};

type FlaggedPost = {
  id: string;
  content: string;
  createdAt: Date;
  flaggedAt: Date | null;
  riskScore: number;
  moderationNotes: string | null;
  images: string[];
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    accountType: string;
    createdAt: Date;
  };
  reports: {
    id: string;
    reason: string;
    details: string | null;
    createdAt: Date;
    reporter: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  }[];
  _count: {
    comments: number;
    likes: number;
    reports: number;
  };
};

export default function ModerationQueueClient({
  user,
  flaggedPosts: initialPosts,
}: {
  user: AdminUser;
  flaggedPosts: FlaggedPost[];
}) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPost, setSelectedPost] = useState<FlaggedPost | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "hide" | "delete" | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleReviewPost = (post: FlaggedPost, action: "approve" | "hide" | "delete") => {
    setSelectedPost(post);
    setReviewAction(action);
    setShowReviewDialog(true);
  };

  const handleConfirmReview = async () => {
    if (!selectedPost || !reviewAction) return;

    setProcessing(true);
    try {
      const response = await fetch(`/api/admin/moderation/${selectedPost.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: reviewAction,
          notes: reviewNotes.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to review post");
      }

      // Remove post from queue
      setPosts(posts.filter(p => p.id !== selectedPost.id));
      setShowReviewDialog(false);
      setSelectedPost(null);
      setReviewAction(null);
      setReviewNotes("");
      
      router.refresh();
    } catch (error) {
      console.error("Error reviewing post:", error);
      alert("Failed to review post. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const getRiskScoreBadge = (score: number) => {
    if (score >= 60) {
      return <Badge variant="destructive">High Risk ({score})</Badge>;
    } else if (score >= 40) {
      return <Badge className="bg-orange-500">Medium Risk ({score})</Badge>;
    } else {
      return <Badge className="bg-yellow-500">Low Risk ({score})</Badge>;
    }
  };

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      SPAM: "Spam",
      HARASSMENT: "Harassment",
      INAPPROPRIATE_CONTENT: "Inappropriate Content",
      FAKE_ACCOUNT: "Fake Account",
      OTHER: "Other",
    };
    return labels[reason] || reason;
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "approve":
        return "bg-green-600 hover:bg-green-700";
      case "hide":
        return "bg-orange-600 hover:bg-orange-700";
      case "delete":
        return "bg-red-600 hover:bg-red-700";
      default:
        return "";
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "approve":
        return <CheckCircle className="h-4 w-4" />;
      case "hide":
        return <EyeOff className="h-4 w-4" />;
      case "delete":
        return <Trash2 className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PlatformHeader 
        user={{
          id: "",
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          accountType: "INDIVIDUAL",
          profileImage: null,
          bio: null,
        }} 
        currentPage="admin" 
      />

      <div className="container mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Content Moderation</h1>
                <p className="text-muted-foreground">Review flagged posts and reports</p>
              </div>
            </div>
          </div>
          <Link href="/admin">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{posts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {posts.reduce((sum, p) => sum + p._count.reports, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                High Risk Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {posts.filter(p => p.riskScore >= 60).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Moderation Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Moderation Queue</CardTitle>
            <CardDescription>
              Review and take action on flagged content
            </CardDescription>
          </CardHeader>
          <CardContent>
            {posts.length === 0 ? (
              <div className="py-12 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-3" />
                <h3 className="text-lg font-semibold mb-2">All Clear!</h3>
                <p className="text-muted-foreground">
                  No posts pending moderation review.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id} className="border-2 border-orange-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gray-200">
                              {post.user.firstName[0]}{post.user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">
                                {post.user.firstName} {post.user.lastName}
                              </p>
                              <Badge variant="outline">{post.user.accountType}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{post.user.email}</p>
                            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Posted {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Flagged {post.flaggedAt ? new Date(post.flaggedAt).toLocaleDateString() : "Recently"}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                Account age: {Math.floor((Date.now() - new Date(post.user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getRiskScoreBadge(post.riskScore)}
                          <Badge variant="destructive">
                            <Flag className="mr-1 h-3 w-3" />
                            {post._count.reports} {post._count.reports === 1 ? "Report" : "Reports"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Post Content */}
                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="whitespace-pre-wrap text-sm">{post.content}</p>
                        {post.images.length > 0 && (
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            {post.images.map((image, idx) => (
                              <img
                                key={idx}
                                src={image}
                                alt={`Post image ${idx + 1}`}
                                className="h-32 w-full rounded object-cover"
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Post Stats */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {post._count.likes} likes
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {post._count.comments} comments
                        </span>
                      </div>

                      {/* Reports */}
                      {post.reports.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-semibold">Reports:</p>
                          {post.reports.map((report) => (
                            <div key={report.id} className="rounded-lg border bg-white p-3">
                              <div className="mb-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{getReasonLabel(report.reason)}</Badge>
                                  <span className="text-xs text-muted-foreground">
                                    by {report.reporter.firstName} {report.reporter.lastName}
                                  </span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(report.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              {report.details && (
                                <p className="text-sm text-gray-700">{report.details}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 border-t pt-4">
                        <Button
                          onClick={() => handleReviewPost(post, "approve")}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReviewPost(post, "hide")}
                          className="flex-1 bg-orange-600 hover:bg-orange-700"
                        >
                          <EyeOff className="mr-2 h-4 w-4" />
                          Hide
                        </Button>
                        <Button
                          onClick={() => handleReviewPost(post, "delete")}
                          variant="destructive"
                          className="flex-1"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Review Confirmation Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {reviewAction && getActionIcon(reviewAction)}
              Confirm {reviewAction?.charAt(0).toUpperCase()}{reviewAction?.slice(1)}
            </DialogTitle>
            <DialogDescription>
              {reviewAction === "approve" && "This post will be unmarked and visible to all users."}
              {reviewAction === "hide" && "This post will be hidden from public view but not deleted."}
              {reviewAction === "delete" && "This post will be permanently deleted. This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="notes">Moderation Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Add notes about your decision for audit trail..."
                rows={3}
                className="mt-2"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowReviewDialog(false)}
                className="flex-1"
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmReview}
                className={`flex-1 ${reviewAction && getActionColor(reviewAction)}`}
                disabled={processing}
              >
                {processing ? "Processing..." : `Confirm ${reviewAction?.charAt(0).toUpperCase()}${reviewAction?.slice(1)}`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
