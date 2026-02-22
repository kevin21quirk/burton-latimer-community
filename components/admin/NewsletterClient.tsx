"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Mail, Send, Users, Image as ImageIcon, Upload, History, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
};

type Newsletter = {
  id: string;
  subject: string;
  content: string;
  htmlContent: string | null;
  images: string[];
  subscriberCount: number;
  sentAt: string;
  sentBy: {
    firstName: string;
    lastName: string;
    email: string;
  };
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
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch("/api/admin/newsletter");
      if (response.ok) {
        const data = await response.json();
        setNewsletters(data.newsletters);
      }
    } catch (err) {
      console.error("Failed to fetch newsletters:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImages([...images, base64]);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

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
        body: JSON.stringify({ subject, content, images }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send newsletter");
      }

      const data = await response.json();
      setSuccess(true);
      setSubject("");
      setContent("");
      setImages([]);
      fetchNewsletters();
      
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

      <div className="container mx-auto max-w-6xl px-4 py-8">
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

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="create">
              <Mail className="mr-2 h-4 w-4" />
              Create Newsletter
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="mr-2 h-4 w-4" />
              Newsletter History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
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
                  placeholder="Write your newsletter content here...\n\nYou can use basic formatting:\n- **bold text**\n- *italic text*\n- Links: [text](url)\n- Headings: # Heading"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={15}
                  className="resize-none font-mono text-sm"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Supports basic Markdown formatting. This content will be sent via email to all subscribers.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Images</Label>
                <div className="flex flex-wrap gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={img}
                        alt={`Newsletter image ${index + 1}`}
                        width={150}
                        height={150}
                        className="rounded-lg object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -right-2 -top-2 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  <label className="flex h-[150px] w-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="mt-2 text-xs text-gray-500">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Add images to your newsletter. Max 5MB per image.
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
                  <li>Use images to make your newsletter more engaging</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter History</CardTitle>
                <CardDescription>
                  View all previously sent newsletters
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingHistory ? (
                  <p className="text-center text-muted-foreground">Loading newsletters...</p>
                ) : newsletters.length === 0 ? (
                  <p className="text-center text-muted-foreground">No newsletters sent yet</p>
                ) : (
                  <div className="space-y-4">
                    {newsletters.map((newsletter) => (
                      <div
                        key={newsletter.id}
                        className="rounded-lg border p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{newsletter.subject}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Sent on {new Date(newsletter.sentAt).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })} by {newsletter.sentBy.firstName} {newsletter.sentBy.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Sent to {newsletter.subscriberCount} {newsletter.subscriberCount === 1 ? 'subscriber' : 'subscribers'}
                            </p>
                            {newsletter.images.length > 0 && (
                              <p className="text-sm text-muted-foreground mt-1">
                                <ImageIcon className="inline h-3 w-3 mr-1" />
                                {newsletter.images.length} {newsletter.images.length === 1 ? 'image' : 'images'}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedNewsletter(newsletter)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {selectedNewsletter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedNewsletter(null)}>
            <Card className="max-w-3xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedNewsletter.subject}</CardTitle>
                    <CardDescription>
                      Sent on {new Date(selectedNewsletter.sentAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedNewsletter(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="whitespace-pre-wrap">{selectedNewsletter.content}</div>
                {selectedNewsletter.images.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Images:</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedNewsletter.images.map((img, index) => (
                        <Image
                          key={index}
                          src={img}
                          alt={`Newsletter image ${index + 1}`}
                          width={300}
                          height={300}
                          className="rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
