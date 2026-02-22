import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import {
  Trash2,
  CheckCircle,
  XCircle,
  HeartHandshake,
  Building2,
  BookOpen,
  Bell,
} from "lucide-react";

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

export function HelpRequestsTab({
  helpRequests,
  loading,
  mounted,
  onDelete,
}: {
  helpRequests: HelpRequest[];
  loading: boolean;
  mounted: boolean;
  onDelete: (id: string) => void;
}) {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "URGENT":
        return "bg-red-100 text-red-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "FULFILLED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <TabsContent value="help-requests" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Help Requests Management</CardTitle>
          <CardDescription>Monitor and manage community help requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {helpRequests.map((request) => (
              <div key={request.id} className="rounded-lg border p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <HeartHandshake className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-semibold">{request.title}</h4>
                    </div>
                    <p className="mb-2 text-sm text-gray-600">{request.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getUrgencyColor(request.urgency)}>
                        {request.urgency}
                      </Badge>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                      <Badge variant="outline">{request.type.replace(/_/g, " ")}</Badge>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      <p>
                        Requested by: {request.requester.firstName} {request.requester.lastName} ({request.requester.email})
                      </p>
                      {request.helper && (
                        <p>
                          Helper: {request.helper.firstName} {request.helper.lastName}
                        </p>
                      )}
                      <p>Created: {mounted ? new Date(request.createdAt).toLocaleString() : "..."}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(request.id)}
                    disabled={loading}
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
  );
}

export function LocalServicesTab({
  localServices,
  loading,
  mounted,
  onVerify,
}: {
  localServices: LocalService[];
  loading: boolean;
  mounted: boolean;
  onVerify: (id: string) => void;
}) {
  return (
    <TabsContent value="local-services" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Local Services Management</CardTitle>
          <CardDescription>Verify and manage local service listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {localServices.map((service) => (
              <div key={service.id} className="rounded-lg border p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-semibold">{service.name}</h4>
                      {service.isVerified && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <p className="mb-2 text-sm text-gray-600">{service.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{service.category.replace(/_/g, " ")}</Badge>
                      {service.isVerified ? (
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">Pending Verification</Badge>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      <p>
                        Added by: {service.createdBy.firstName} {service.createdBy.lastName} ({service.createdBy.email})
                      </p>
                      <p>Created: {mounted ? new Date(service.createdAt).toLocaleString() : "..."}</p>
                    </div>
                  </div>
                  {!service.isVerified && (
                    <Button
                      size="sm"
                      onClick={() => onVerify(service.id)}
                      disabled={loading}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Verify
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export function WellbeingResourcesTab({
  wellbeingResources,
  loading,
  mounted,
  onPublish,
}: {
  wellbeingResources: WellbeingResource[];
  loading: boolean;
  mounted: boolean;
  onPublish: (id: string) => void;
}) {
  return (
    <TabsContent value="wellbeing" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Wellbeing Resources Management</CardTitle>
          <CardDescription>Publish and manage wellbeing resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {wellbeingResources.map((resource) => (
              <div key={resource.id} className="rounded-lg border p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-semibold">{resource.title}</h4>
                    </div>
                    <p className="mb-2 text-sm text-gray-600">{resource.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{resource.category.replace(/_/g, " ")}</Badge>
                      {resource.isPublished ? (
                        <Badge className="bg-green-100 text-green-800">Published</Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      <p>
                        Created by: {resource.createdBy.firstName} {resource.createdBy.lastName} ({resource.createdBy.email})
                      </p>
                      <p>Created: {mounted ? new Date(resource.createdAt).toLocaleString() : "..."}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onPublish(resource.id)}
                    disabled={loading}
                    variant={resource.isPublished ? "outline" : "default"}
                  >
                    {resource.isPublished ? (
                      <>
                        <XCircle className="mr-2 h-4 w-4" />
                        Unpublish
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Publish
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export function AlertsTab({
  alerts,
  loading,
  mounted,
  onToggle,
}: {
  alerts: Alert[];
  loading: boolean;
  mounted: boolean;
  onToggle: (id: string) => void;
}) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-100 text-red-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <TabsContent value="alerts" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Alerts Management</CardTitle>
          <CardDescription>Manage community alerts and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="rounded-lg border p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-semibold">{alert.title}</h4>
                    </div>
                    <p className="mb-2 text-sm text-gray-600">{alert.message}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getPriorityColor(alert.priority)}>
                        {alert.priority}
                      </Badge>
                      <Badge variant="outline">{alert.type.replace(/_/g, " ")}</Badge>
                      {alert.isActive ? (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      <p>
                        Created by: {alert.createdBy.firstName} {alert.createdBy.lastName}
                      </p>
                      <p>Created: {mounted ? new Date(alert.createdAt).toLocaleString() : "..."}</p>
                      {alert.expiresAt && (
                        <p>Expires: {mounted ? new Date(alert.expiresAt).toLocaleString() : "..."}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onToggle(alert.id)}
                    disabled={loading}
                    variant={alert.isActive ? "outline" : "default"}
                  >
                    {alert.isActive ? (
                      <>
                        <XCircle className="mr-2 h-4 w-4" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Activate
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
