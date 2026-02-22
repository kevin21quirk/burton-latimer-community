"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  AlertCircle,
  CloudRain,
  Shield,
  Megaphone,
  Users,
  ArrowLeft,
} from "lucide-react";
import PlatformHeader from "@/components/shared/PlatformHeader";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: string;
  profileImage: string | null;
  isAdmin: boolean;
};

type Alert = {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  createdAt: Date;
  expiresAt: Date | null;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    accountType: string;
  };
};

export default function AlertsClient({
  user,
  alerts,
}: {
  user: User;
  alerts: Alert[];
}) {
  const router = useRouter();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "URGENT_HELP":
        return <AlertCircle className="h-5 w-5" />;
      case "WEATHER_WARNING":
        return <CloudRain className="h-5 w-5" />;
      case "SAFETY_ALERT":
        return <Shield className="h-5 w-5" />;
      case "PLATFORM_ANNOUNCEMENT":
        return <Megaphone className="h-5 w-5" />;
      case "COMMUNITY_UPDATE":
        return <Users className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    return type.replace(/_/g, " ");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-100 text-red-800 border-red-300";
      case "HIGH":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "URGENT_HELP":
        return "bg-red-50 border-red-200";
      case "WEATHER_WARNING":
        return "bg-blue-50 border-blue-200";
      case "SAFETY_ALERT":
        return "bg-orange-50 border-orange-200";
      case "PLATFORM_ANNOUNCEMENT":
        return "bg-purple-50 border-purple-200";
      case "COMMUNITY_UPDATE":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const alertsByType = {
    URGENT_HELP: alerts.filter((a) => a.type === "URGENT_HELP"),
    WEATHER_WARNING: alerts.filter((a) => a.type === "WEATHER_WARNING"),
    SAFETY_ALERT: alerts.filter((a) => a.type === "SAFETY_ALERT"),
    PLATFORM_ANNOUNCEMENT: alerts.filter((a) => a.type === "PLATFORM_ANNOUNCEMENT"),
    COMMUNITY_UPDATE: alerts.filter((a) => a.type === "COMMUNITY_UPDATE"),
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <PlatformHeader user={user} currentPage="alerts" />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold">Alerts & Updates</h1>
          <p className="text-muted-foreground">
            Important notifications and community alerts
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All ({alerts.length})</TabsTrigger>
            <TabsTrigger value="urgent">
              <AlertCircle className="mr-2 h-4 w-4" />
              Urgent ({alertsByType.URGENT_HELP.length})
            </TabsTrigger>
            <TabsTrigger value="weather">
              <CloudRain className="mr-2 h-4 w-4" />
              Weather ({alertsByType.WEATHER_WARNING.length})
            </TabsTrigger>
            <TabsTrigger value="safety">
              <Shield className="mr-2 h-4 w-4" />
              Safety ({alertsByType.SAFETY_ALERT.length})
            </TabsTrigger>
            <TabsTrigger value="announcements">
              <Megaphone className="mr-2 h-4 w-4" />
              Announcements ({alertsByType.PLATFORM_ANNOUNCEMENT.length})
            </TabsTrigger>
            <TabsTrigger value="community">
              <Users className="mr-2 h-4 w-4" />
              Community ({alertsByType.COMMUNITY_UPDATE.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">No active alerts at the moment</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <Card key={alert.id} className={`border-l-4 ${getTypeColor(alert.type)}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-white p-2 shadow-sm">
                            {getAlertIcon(alert.type)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{alert.title}</CardTitle>
                            <div className="mt-1 flex items-center gap-2">
                              <Badge className={getPriorityColor(alert.priority)}>
                                {alert.priority}
                              </Badge>
                              <Badge variant="outline">{getTypeLabel(alert.type)}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-3 text-gray-700">{alert.message}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Posted {formatDate(alert.createdAt)}</span>
                        {alert.expiresAt && (
                          <span>Expires {formatDate(alert.expiresAt)}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {Object.entries(alertsByType).map(([type, typeAlerts]) => (
            <TabsContent
              key={type}
              value={type.toLowerCase().replace("_", "")}
              className="mt-6"
            >
              <div className="space-y-4">
                {typeAlerts.length === 0 ? (
                  <div className="py-12 text-center">
                    <Bell className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      No {getTypeLabel(type).toLowerCase()} alerts
                    </p>
                  </div>
                ) : (
                  typeAlerts.map((alert) => (
                    <Card key={alert.id} className={`border-l-4 ${getTypeColor(alert.type)}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="rounded-full bg-white p-2 shadow-sm">
                              {getAlertIcon(alert.type)}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{alert.title}</CardTitle>
                              <div className="mt-1">
                                <Badge className={getPriorityColor(alert.priority)}>
                                  {alert.priority}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-3 text-gray-700">{alert.message}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Posted {formatDate(alert.createdAt)}</span>
                          {alert.expiresAt && (
                            <span>Expires {formatDate(alert.expiresAt)}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
