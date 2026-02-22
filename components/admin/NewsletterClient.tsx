"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Mail, Send, Users } from "lucide-react";
import Link from "next/link";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
};

export default function NewsletterClient({
  user,
  subscriberCount,
}: {
  user: User;
  subscriberCount: number;
}) {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !content.trim()) {
      setError("Please fill in both subject and content");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, content }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send newsletter");
      }

      const data = await response.json();
      setSuccess(true);
      setSubject("");
      setContent("");
      
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send newsletter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Newsletter & Communications</h1>
              <p className="text-sm text-muted-foreground">
                Send updates and news to community members
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{subscriberCount} subscribers</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-8">
        {success && (
          <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-800">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <p className="font-semibold">Newsletter sent successfully!</p>
            </div>
            <p className="mt-1 text-sm">
              Your newsletter has been sent to {subscriberCount} subscribers.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">
            <p className="font-semibold">Error</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Create Newsletter</CardTitle>
            <CardDescription>
              Compose and send a newsletter to all users who have opted in to receive
              updates and news about the Burton Latimer Community.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Community Update - February 2026"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Newsletter Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your newsletter content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={15}
                  className="resize-none"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This content will be sent via email to all subscribers.
                </p>
              </div>

              <div className="flex items-center justify-between border-t pt-6">
                <div className="text-sm text-muted-foreground">
                  This will be sent to <strong>{subscriberCount}</strong>{" "}
                  {subscriberCount === 1 ? "subscriber" : "subscribers"}
                </div>
                <Button type="submit" disabled={loading} size="lg">
                  <Send className="mr-2 h-4 w-4" />
                  {loading ? "Sending..." : "Send Newsletter"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Newsletter Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>Keep your subject line clear and engaging</li>
              <li>Include important community updates and upcoming events</li>
              <li>Highlight new features or services available to members</li>
              <li>Keep the content concise and easy to read</li>
              <li>Include a call-to-action if appropriate</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
