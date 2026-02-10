"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Home, 
  Users, 
  MessageCircle, 
  Bell, 
  Settings, 
  LogOut,
  Heart,
  MessageSquare,
  Share2,
  Image as ImageIcon,
  Building2,
  HandHeart,
  Calendar
} from "lucide-react";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: string;
  profileImage: string | null;
  bio: string | null;
};

type Post = {
  id: string;
  content: string;
  postType: string;
  images: string[];
  createdAt: Date;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    accountType: string;
    profileImage: string | null;
    companyName: string | null;
  };
  likes: { userId: string }[];
  comments: { id: string }[];
};

export default function DashboardClient({
  user,
  initialPosts,
}: {
  user: User;
  initialPosts: Post[];
}) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [newPostContent, setNewPostContent] = useState("");
  const [postType, setPostType] = useState("GENERAL");
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newPostContent,
          postType,
        }),
      });

      if (response.ok) {
        const newPost = await response.json();
        setPosts([newPost, ...posts]);
        setNewPostContent("");
        setPostType("GENERAL");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });

      if (response.ok) {
        setPosts(posts.map(post => {
          if (post.id === postId) {
            const isLiked = post.likes.some(like => like.userId === user.id);
            return {
              ...post,
              likes: isLiked
                ? post.likes.filter(like => like.userId !== user.id)
                : [...post.likes, { userId: user.id }],
            };
          }
          return post;
        }));
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "HELP_REQUEST":
        return <HandHeart className="h-4 w-4 text-accent" />;
      case "BUSINESS_AD":
        return <Building2 className="h-4 w-4 text-accent" />;
      case "EVENT":
        return <Calendar className="h-4 w-4 text-accent" />;
      default:
        return null;
    }
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case "HELP_REQUEST":
        return "Help Request";
      case "BUSINESS_AD":
        return "Business Ad";
      case "EVENT":
        return "Event";
      default:
        return "Post";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary" />
            <span className="text-xl font-bold">Burton Latimer</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Home className="h-5 w-5" />
            </Button>
            <Link href="/groups">
              <Button variant="ghost" size="icon">
                <Users className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/messages">
              <Button variant="ghost" size="icon">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Link href="/profile">
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback className="bg-accent text-accent-foreground">
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto grid gap-6 px-4 py-6 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-accent text-2xl text-accent-foreground">
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mt-4 font-semibold">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">{user.accountType}</p>
                {user.bio && (
                  <p className="mt-2 text-sm text-muted-foreground">{user.bio}</p>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/profile">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Profile Settings
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </aside>

        <main className="lg:col-span-6">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-accent text-accent-foreground">
                      {user.firstName[0]}{user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Textarea
                    placeholder="What's on your mind?"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={3}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Select value={postType} onValueChange={setPostType}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GENERAL">General Post</SelectItem>
                        <SelectItem value="HELP_REQUEST">Help Request</SelectItem>
                        <SelectItem value="BUSINESS_AD">Business Ad</SelectItem>
                        <SelectItem value="EVENT">Event</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" size="icon">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button type="submit" disabled={loading || !newPostContent.trim()}>
                    {loading ? "Posting..." : "Post"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-accent text-accent-foreground">
                          {post.user.firstName[0]}{post.user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {post.user.companyName || `${post.user.firstName} ${post.user.lastName}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {post.postType !== "GENERAL" && (
                      <div className="flex items-center gap-1 text-sm">
                        {getPostTypeIcon(post.postType)}
                        <span className="text-muted-foreground">
                          {getPostTypeLabel(post.postType)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
                  <div className="flex items-center gap-4 border-t pt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={
                        post.likes.some(like => like.userId === user.id)
                          ? "text-accent"
                          : ""
                      }
                    >
                      <Heart
                        className={`mr-1 h-4 w-4 ${
                          post.likes.some(like => like.userId === user.id)
                            ? "fill-current"
                            : ""
                        }`}
                      />
                      {post.likes.length}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="mr-1 h-4 w-4" />
                      {post.comments.length}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="mr-1 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>

        <aside className="lg:col-span-3">
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Suggested Groups</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-accent" />
                  <div>
                    <p className="text-sm font-medium">Local Events</p>
                    <p className="text-xs text-muted-foreground">234 members</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Join</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-accent" />
                  <div>
                    <p className="text-sm font-medium">Community Help</p>
                    <p className="text-xs text-muted-foreground">156 members</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Join</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-accent" />
                  <div>
                    <p className="text-sm font-medium">Local Business</p>
                    <p className="text-xs text-muted-foreground">89 members</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Join</Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
