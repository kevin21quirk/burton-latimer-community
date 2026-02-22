"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Heart,
  DollarSign,
  UtensilsCrossed,
  Building,
  Shield,
  BookOpen,
  ExternalLink,
  ArrowLeft,
  Home,
} from "lucide-react";
import PlatformHeader from "@/components/shared/PlatformHeader";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: string;
  profileImage: string | null;
};

type WellbeingResource = {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  externalUrl: string | null;
  createdAt: Date;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    accountType: string;
  };
};

export default function WellbeingClient({
  user,
  resources,
}: {
  user: User;
  resources: WellbeingResource[];
}) {
  const router = useRouter();
  const [selectedResource, setSelectedResource] = useState<WellbeingResource | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "MENTAL_WELLBEING":
        return <Heart className="h-5 w-5" />;
      case "FINANCIAL_ADVICE":
        return <DollarSign className="h-5 w-5" />;
      case "FOOD_SUPPORT":
        return <UtensilsCrossed className="h-5 w-5" />;
      case "LOCAL_AUTHORITY":
        return <Building className="h-5 w-5" />;
      case "ONLINE_SAFETY":
        return <Shield className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.replace(/_/g, " ");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "MENTAL_WELLBEING":
        return "bg-pink-100 text-pink-800 border-pink-300";
      case "FINANCIAL_ADVICE":
        return "bg-green-100 text-green-800 border-green-300";
      case "FOOD_SUPPORT":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "LOCAL_AUTHORITY":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "ONLINE_SAFETY":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const resourcesByCategory = {
    MENTAL_WELLBEING: resources.filter((r) => r.category === "MENTAL_WELLBEING"),
    FINANCIAL_ADVICE: resources.filter((r) => r.category === "FINANCIAL_ADVICE"),
    FOOD_SUPPORT: resources.filter((r) => r.category === "FOOD_SUPPORT"),
    LOCAL_AUTHORITY: resources.filter((r) => r.category === "LOCAL_AUTHORITY"),
    ONLINE_SAFETY: resources.filter((r) => r.category === "ONLINE_SAFETY"),
    GENERAL_GUIDANCE: resources.filter((r) => r.category === "GENERAL_GUIDANCE"),
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <PlatformHeader user={user} currentPage="wellbeing" />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold">Wellbeing & Guidance</h1>
            <p className="text-muted-foreground">
              Support resources and helpful information for your wellbeing
            </p>
          </div>
        </div>

        {/* Resource Detail Dialog */}
        <Dialog open={!!selectedResource} onOpenChange={() => setSelectedResource(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedResource && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedResource.title}</DialogTitle>
                  <DialogDescription>{selectedResource.description}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Badge className={getCategoryColor(selectedResource.category)}>
                    {getCategoryLabel(selectedResource.category)}
                  </Badge>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700">{selectedResource.content}</p>
                  </div>
                  {selectedResource.externalUrl && (
                    <div className="border-t pt-4">
                      <a
                        href={selectedResource.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Visit external resource
                      </a>
                    </div>
                  )}
                  <div className="border-t pt-4 text-sm text-muted-foreground">
                    Provided by {selectedResource.createdBy.firstName}{" "}
                    {selectedResource.createdBy.lastName}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all">All ({resources.length})</TabsTrigger>
            <TabsTrigger value="mental">
              <Heart className="mr-2 h-4 w-4" />
              Mental ({resourcesByCategory.MENTAL_WELLBEING.length})
            </TabsTrigger>
            <TabsTrigger value="financial">
              <DollarSign className="mr-2 h-4 w-4" />
              Financial ({resourcesByCategory.FINANCIAL_ADVICE.length})
            </TabsTrigger>
            <TabsTrigger value="food">
              <UtensilsCrossed className="mr-2 h-4 w-4" />
              Food ({resourcesByCategory.FOOD_SUPPORT.length})
            </TabsTrigger>
            <TabsTrigger value="authority">
              <Building className="mr-2 h-4 w-4" />
              Authority ({resourcesByCategory.LOCAL_AUTHORITY.length})
            </TabsTrigger>
            <TabsTrigger value="safety">
              <Shield className="mr-2 h-4 w-4" />
              Safety ({resourcesByCategory.ONLINE_SAFETY.length})
            </TabsTrigger>
            <TabsTrigger value="general">
              General ({resourcesByCategory.GENERAL_GUIDANCE.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resources.length === 0 ? (
                <div className="col-span-full py-12 text-center">
                  <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">No resources available yet</p>
                </div>
              ) : (
                resources.map((resource) => (
                  <Card
                    key={resource.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedResource(resource)}
                  >
                    <CardHeader>
                      <div className="mb-2 flex items-center gap-2">
                        <div className={`rounded-full p-2 ${getCategoryColor(resource.category)}`}>
                          {getCategoryIcon(resource.category)}
                        </div>
                        <Badge className={getCategoryColor(resource.category)}>
                          {getCategoryLabel(resource.category)}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {resource.description}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {Object.entries(resourcesByCategory).map(([category, categoryResources]) => (
            <TabsContent
              key={category}
              value={category.toLowerCase().replace("_", "")}
              className="mt-6"
            >
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryResources.length === 0 ? (
                  <div className="col-span-full py-12 text-center">
                    <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      No {getCategoryLabel(category).toLowerCase()} resources available yet
                    </p>
                  </div>
                ) : (
                  categoryResources.map((resource) => (
                    <Card
                      key={resource.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedResource(resource)}
                    >
                      <CardHeader>
                        <div className="mb-2 flex items-center gap-2">
                          <div className={`rounded-full p-2 ${getCategoryColor(resource.category)}`}>
                            {getCategoryIcon(resource.category)}
                          </div>
                        </div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {resource.description}
                        </p>
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
