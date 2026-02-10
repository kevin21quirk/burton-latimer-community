"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send } from "lucide-react";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
};

type Message = {
  id: string;
  content: string;
  read: boolean;
  createdAt: Date;
  senderId: string;
  receiverId: string;
  sender: User;
  receiver: User;
};

export default function MessagesClient({
  user,
  conversations,
  users,
}: {
  user: User;
  conversations: Message[];
  users: (User & { accountType: string })[];
}) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(conversations);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const conversationUsers = Array.from(
    new Map(
      messages.map((msg) => {
        const otherUser = msg.senderId === user.id ? msg.receiver : msg.sender;
        return [otherUser.id, otherUser];
      })
    ).values()
  );

  const selectedMessages = selectedUser
    ? messages.filter(
        (msg) =>
          (msg.senderId === user.id && msg.receiverId === selectedUser) ||
          (msg.senderId === selectedUser && msg.receiverId === user.id)
      )
    : [];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    setLoading(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: selectedUser,
          content: newMessage,
        }),
      });

      if (response.ok) {
        const message = await response.json();
        setMessages([...messages, message]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-white">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary" />
            <span className="text-xl font-bold">Messages</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {conversationUsers.map((convUser) => (
                    <button
                      key={convUser.id}
                      onClick={() => setSelectedUser(convUser.id)}
                      className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted ${
                        selectedUser === convUser.id ? "bg-muted" : ""
                      }`}
                    >
                      <Avatar>
                        <AvatarFallback className="bg-accent text-accent-foreground">
                          {convUser.firstName[0]}
                          {convUser.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">
                          {convUser.firstName} {convUser.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Click to view messages
                        </p>
                      </div>
                    </button>
                  ))}
                  {conversationUsers.length === 0 && (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No conversations yet. Start a new conversation below.
                    </p>
                  )}
                </div>
              </ScrollArea>

              <div className="mt-4 border-t pt-4">
                <p className="mb-2 text-sm font-medium">Start New Conversation</p>
                <div className="space-y-2">
                  {users.slice(0, 5).map((u) => (
                    <button
                      key={u.id}
                      onClick={() => setSelectedUser(u.id)}
                      className="flex w-full items-center gap-2 rounded-lg p-2 text-left transition-colors hover:bg-muted"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-accent text-xs text-accent-foreground">
                          {u.firstName[0]}
                          {u.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {u.firstName} {u.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{u.accountType}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-8">
            <CardHeader>
              {selectedUser && (
                <CardTitle>
                  {(() => {
                    const selectedUserData =
                      conversationUsers.find((u) => u.id === selectedUser) ||
                      users.find((u) => u.id === selectedUser);
                    return selectedUserData
                      ? `${selectedUserData.firstName} ${selectedUserData.lastName}`
                      : "Select a conversation";
                  })()}
                </CardTitle>
              )}
              {!selectedUser && <CardTitle>Select a conversation</CardTitle>}
            </CardHeader>
            <CardContent>
              {selectedUser ? (
                <>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {selectedMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.senderId === user.id ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              msg.senderId === user.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p
                              className={`mt-1 text-xs ${
                                msg.senderId === user.id
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {selectedMessages.length === 0 && (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                          No messages yet. Start the conversation!
                        </p>
                      )}
                    </div>
                  </ScrollArea>

                  <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={loading || !newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex h-[500px] items-center justify-center">
                  <p className="text-muted-foreground">
                    Select a conversation to start messaging
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
