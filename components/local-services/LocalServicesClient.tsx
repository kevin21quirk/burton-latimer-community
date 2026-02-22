"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Heart,
  Building,
  Home as HomeIcon,
  UtensilsCrossed,
  Stethoscope,
  Plus,
  Phone,
  Mail,
  Globe,
  MapPin,
  CheckCircle,
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

type LocalService = {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string | null;
  phoneNumber: string | null;
  email: string | null;
  website: string | null;
  isVerified: boolean;
  createdAt: Date;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    accountType: string;
  };
};

export default function LocalServicesClient({
  user,
  services,
}: {
  user: User;
  services: LocalService[];
}) {
  const router = useRouter();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      category: formData.get("category"),
      address: formData.get("address"),
      phoneNumber: formData.get("phoneNumber"),
      email: formData.get("email"),
      website: formData.get("website"),
    };

    try {
      const response = await fetch("/api/local-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setShowAddDialog(false);
        router.refresh();
      } else {
        alert("Failed to add service. Please try again.");
      }
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Error adding service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "CARE_PROVIDER":
        return <Stethoscope className="h-5 w-5" />;
      case "CHARITY":
        return <Heart className="h-5 w-5" />;
      case "COUNCIL_SERVICE":
        return <Building className="h-5 w-5" />;
      case "COMMUNITY_CENTRE":
        return <HomeIcon className="h-5 w-5" />;
      case "FOOD_BANK":
        return <UtensilsCrossed className="h-5 w-5" />;
      case "HEALTH_SERVICE":
        return <Stethoscope className="h-5 w-5" />;
      default:
        return <Building2 className="h-5 w-5" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.replace(/_/g, " ");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "CARE_PROVIDER":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "CHARITY":
        return "bg-pink-100 text-pink-800 border-pink-300";
      case "COUNCIL_SERVICE":
        return "bg-indigo-100 text-indigo-800 border-indigo-300";
      case "COMMUNITY_CENTRE":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "FOOD_BANK":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "HEALTH_SERVICE":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const servicesByCategory = {
    CARE_PROVIDER: filteredServices.filter((s) => s.category === "CARE_PROVIDER"),
    CHARITY: filteredServices.filter((s) => s.category === "CHARITY"),
    COUNCIL_SERVICE: filteredServices.filter((s) => s.category === "COUNCIL_SERVICE"),
    COMMUNITY_CENTRE: filteredServices.filter((s) => s.category === "COMMUNITY_CENTRE"),
    FOOD_BANK: filteredServices.filter((s) => s.category === "FOOD_BANK"),
    HEALTH_SERVICE: filteredServices.filter((s) => s.category === "HEALTH_SERVICE"),
    OTHER: filteredServices.filter((s) => s.category === "OTHER"),
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <PlatformHeader user={user} currentPage="local-services" />

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
            <h1 className="text-3xl font-bold">Local Services</h1>
            <p className="text-muted-foreground">
              Trusted organisations and services in your community
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-5 w-5" />
            Add Service
          </Button>
        </div>

        {/* Add Service Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Local Service</DialogTitle>
              <DialogDescription>
                Add a trusted organisation or service to help the community
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Burton Latimer Community Centre"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="What services do they provide?"
                  rows={3}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CARE_PROVIDER">Care Provider</SelectItem>
                    <SelectItem value="CHARITY">Charity</SelectItem>
                    <SelectItem value="COUNCIL_SERVICE">Council Service</SelectItem>
                    <SelectItem value="COMMUNITY_CENTRE">Community Centre</SelectItem>
                    <SelectItem value="FOOD_BANK">Food Bank</SelectItem>
                    <SelectItem value="HEALTH_SERVICE">Health Service</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="address">Address (Optional)</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="e.g., High Street, Burton Latimer"
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="e.g., 01536 123456"
                />
              </div>
              <div>
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="e.g., info@service.org"
                />
              </div>
              <div>
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="e.g., https://www.service.org"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
                  {loading ? "Adding..." : "Add Service"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all">All ({filteredServices.length})</TabsTrigger>
            <TabsTrigger value="care">Care ({servicesByCategory.CARE_PROVIDER.length})</TabsTrigger>
            <TabsTrigger value="charity">Charity ({servicesByCategory.CHARITY.length})</TabsTrigger>
            <TabsTrigger value="council">Council ({servicesByCategory.COUNCIL_SERVICE.length})</TabsTrigger>
            <TabsTrigger value="community">Community ({servicesByCategory.COMMUNITY_CENTRE.length})</TabsTrigger>
            <TabsTrigger value="food">Food ({servicesByCategory.FOOD_BANK.length})</TabsTrigger>
            <TabsTrigger value="health">Health ({servicesByCategory.HEALTH_SERVICE.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredServices.length === 0 ? (
                <div className="col-span-full py-12 text-center">
                  <Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">No services found</p>
                </div>
              ) : (
                filteredServices.map((service) => (
                  <Card key={service.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`rounded-full p-2 ${getCategoryColor(service.category)}`}>
                            {getCategoryIcon(service.category)}
                          </div>
                          <Badge className={getCategoryColor(service.category)}>
                            {getCategoryLabel(service.category)}
                          </Badge>
                        </div>
                        {service.isVerified && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-3 text-sm text-gray-600">{service.description}</p>
                      <div className="space-y-2 text-sm">
                        {service.address && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            {service.address}
                          </div>
                        )}
                        {service.phoneNumber && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${service.phoneNumber}`} className="hover:text-blue-600">
                              {service.phoneNumber}
                            </a>
                          </div>
                        )}
                        {service.email && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="h-4 w-4" />
                            <a href={`mailto:${service.email}`} className="hover:text-blue-600">
                              {service.email}
                            </a>
                          </div>
                        )}
                        {service.website && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Globe className="h-4 w-4" />
                            <a
                              href={service.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-600"
                            >
                              Visit Website
                            </a>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
            <TabsContent
              key={category}
              value={category.toLowerCase().replace("_", "")}
              className="mt-6"
            >
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryServices.length === 0 ? (
                  <div className="col-span-full py-12 text-center">
                    <Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      No {getCategoryLabel(category).toLowerCase()} services found
                    </p>
                  </div>
                ) : (
                  categoryServices.map((service) => (
                    <Card key={service.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="mb-2 flex items-center justify-between">
                          <div className={`rounded-full p-2 ${getCategoryColor(service.category)}`}>
                            {getCategoryIcon(service.category)}
                          </div>
                          {service.isVerified && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-3 text-sm text-gray-600">{service.description}</p>
                        <div className="space-y-2 text-sm">
                          {service.address && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="h-4 w-4" />
                              {service.address}
                            </div>
                          )}
                          {service.phoneNumber && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="h-4 w-4" />
                              <a href={`tel:${service.phoneNumber}`} className="hover:text-blue-600">
                                {service.phoneNumber}
                              </a>
                            </div>
                          )}
                          {service.email && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="h-4 w-4" />
                              <a href={`mailto:${service.email}`} className="hover:text-blue-600">
                                {service.email}
                              </a>
                            </div>
                          )}
                          {service.website && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Globe className="h-4 w-4" />
                              <a
                                href={service.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-600"
                              >
                                Visit Website
                              </a>
                            </div>
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
