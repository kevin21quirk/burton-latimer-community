"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Users, Lock, Globe } from "lucide-react";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
};

type Group = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  isPrivate: boolean;
  createdAt: Date;
  members: { userId: string; role: string }[];
  _count: {
    members: number;
    posts: number;
  };
};

type UserGroup = {
  id: string;
  role: string;
  joinedAt: Date;
  group: Group;
};

export default function GroupsClient({
  user,
  groups,
  userGroups,
}: {
  user: User;
  groups: Group[];
  userGroups: UserGroup[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allGroups, setAllGroups] = useState(groups);

  const handleCreateGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      isPrivate: formData.get("isPrivate") === "on",
    };

    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newGroup = await response.json();
        setAllGroups([newGroup, ...allGroups]);
        setOpen(false);
        e.currentTarget.reset();
      }
    } catch (error) {
      console.error("Error creating group:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/join`, {
        method: "POST",
      });

      if (response.ok) {
        setAllGroups(
          allGroups.map((group) =>
            group.id === groupId
              ? {
                  ...group,
                  members: [...group.members, { userId: user.id, role: "member" }],
                  _count: { ...group._count, members: group._count.members + 1 },
                }
              : group
          )
        );
      }
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/leave`, {
        method: "POST",
      });

      if (response.ok) {
        setAllGroups(
          allGroups.map((group) =>
            group.id === groupId
              ? {
                  ...group,
                  members: group.members.filter((m) => m.userId !== user.id),
                  _count: { ...group._count, members: group._count.members - 1 },
                }
              : group
          )
        );
      }
    } catch (error) {
      console.error("Error leaving group:", error);
    }
  };

  const isMember = (group: Group) => group.members.some((m) => m.userId === user.id);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary" />
              <span className="text-xl font-bold">Community Groups</span>
            </div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Group</DialogTitle>
                <DialogDescription>
                  Start a new community group for people with shared interests
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Group Name *</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="What is this group about?"
                    rows={3}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isPrivate" name="isPrivate" />
                  <Label htmlFor="isPrivate" className="text-sm font-normal">
                    Make this group private (members must be approved)
                  </Label>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating..." : "Create Group"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Groups</TabsTrigger>
            <TabsTrigger value="my-groups">My Groups ({userGroups.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allGroups.map((group) => (
                <Card key={group.id}>
                  <CardHeader>
                    <div className="mb-2 flex h-24 items-center justify-center rounded-lg bg-accent">
                      <Users className="h-12 w-12 text-accent-foreground" />
                    </div>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      {group.isPrivate ? (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Globe className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <CardDescription>
                      {group.description || "No description provided"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex gap-4 text-sm text-muted-foreground">
                      <span>{group._count.members} members</span>
                      <span>{group._count.posts} posts</span>
                    </div>
                    {isMember(group) ? (
                      <div className="space-y-2">
                        <Badge className="w-full justify-center">Member</Badge>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => handleLeaveGroup(group.id)}
                        >
                          Leave Group
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => handleJoinGroup(group.id)}
                      >
                        Join Group
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-groups">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userGroups.map((userGroup) => (
                <Card key={userGroup.id}>
                  <CardHeader>
                    <div className="mb-2 flex h-24 items-center justify-center rounded-lg bg-accent">
                      <Users className="h-12 w-12 text-accent-foreground" />
                    </div>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{userGroup.group.name}</CardTitle>
                      {userGroup.group.isPrivate ? (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Globe className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <CardDescription>
                      {userGroup.group.description || "No description provided"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex gap-4 text-sm text-muted-foreground">
                      <span>{userGroup.group._count.members} members</span>
                      <span>{userGroup.group._count.posts} posts</span>
                    </div>
                    <div className="space-y-2">
                      <Badge variant="secondary" className="w-full justify-center">
                        {userGroup.role}
                      </Badge>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleLeaveGroup(userGroup.group.id)}
                      >
                        Leave Group
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {userGroups.length === 0 && (
                <div className="col-span-full py-12 text-center">
                  <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    You haven't joined any groups yet. Browse all groups to find communities
                    that interest you!
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
