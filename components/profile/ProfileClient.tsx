"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import PlatformHeader from "@/components/shared/PlatformHeader";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: string;
  dateOfBirth: Date | null;
  phoneNumber: string | null;
  address: string | null;
  city: string;
  postcode: string | null;
  companyName: string | null;
  charityNumber: string | null;
  bio: string | null;
  profileImage: string | null;
  coverImage: string | null;
  interests: string[];
  marketingConsent: boolean;
  createdAt: Date;
};

export default function ProfileClient({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(user.profileImage);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user.profileImage);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleUploadImage = async () => {
    if (!selectedFile) return;

    setUploadingImage(true);
    setError("");

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        
        const response = await fetch("/api/profile/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Image }),
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const data = await response.json();
        setProfileImage(data.profileImage);
        setImagePreview(data.profileImage);
        setSelectedFile(null);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      };
      reader.readAsDataURL(selectedFile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phoneNumber: formData.get("phoneNumber"),
      address: formData.get("address"),
      city: formData.get("city"),
      postcode: formData.get("postcode"),
      companyName: formData.get("companyName"),
      charityNumber: formData.get("charityNumber"),
      bio: formData.get("bio"),
      interests: formData.get("interests") 
        ? (formData.get("interests") as string).split(",").map(i => i.trim()).filter(i => i.length > 0)
        : [],
      marketingConsent: formData.get("marketingConsent") === "on",
    };

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PlatformHeader user={user} currentPage="profile" />

      <div className="container mx-auto max-w-4xl px-4 py-6">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-accent text-2xl text-accent-foreground">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-muted-foreground">{user.accountType}</p>
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="privacy">Privacy & Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>
                  Update your personal information and profile details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  {success && (
                    <div className="rounded-md bg-accent/50 p-3 text-sm text-accent-foreground">
                      Profile updated successfully!
                    </div>
                  )}
                  {error && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  {/* Profile Image Upload Section */}
                  <div className="space-y-4">
                    <Label>Profile Image</Label>
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        {imagePreview ? (
                          <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-gray-200">
                            <Image
                              src={imagePreview}
                              alt="Profile preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <Avatar className="h-32 w-32">
                            <AvatarFallback className="bg-accent text-4xl text-accent-foreground">
                              {user.firstName[0]}
                              {user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('profile-image-upload')?.click()}
                            disabled={uploadingImage}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Choose Image
                          </Button>
                          {selectedFile && (
                            <>
                              <Button
                                type="button"
                                onClick={handleUploadImage}
                                disabled={uploadingImage}
                              >
                                {uploadingImage ? "Uploading..." : "Upload"}
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={handleRemoveImage}
                                disabled={uploadingImage}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                        <input
                          id="profile-image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageSelect}
                        />
                        <p className="text-xs text-muted-foreground">
                          Upload a profile photo. Max size: 5MB. Recommended: Square image, at least 400x400px.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        defaultValue={user.firstName}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        defaultValue={user.lastName}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={user.email}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      defaultValue={user.phoneNumber || ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      defaultValue={user.address || ""}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        defaultValue={user.city}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postcode">Postcode</Label>
                      <Input
                        id="postcode"
                        name="postcode"
                        defaultValue={user.postcode || ""}
                      />
                    </div>
                  </div>

                  {user.accountType === "COMPANY" && (
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        defaultValue={user.companyName || ""}
                      />
                    </div>
                  )}

                  {user.accountType === "CHARITY" && (
                    <div className="space-y-2">
                      <Label htmlFor="charityNumber">Charity Registration Number</Label>
                      <Input
                        id="charityNumber"
                        name="charityNumber"
                        defaultValue={user.charityNumber || ""}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="Tell us about yourself..."
                      rows={4}
                      defaultValue={user.bio || ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interests">Interests</Label>
                    <Input
                      id="interests"
                      name="interests"
                      placeholder="e.g., Gardening, Cooking, Sports (comma-separated)"
                      defaultValue={user.interests.join(", ")}
                    />
                    <p className="text-xs text-muted-foreground">
                      Help us connect you with people who share your interests
                    </p>
                  </div>

                  <Button type="submit" disabled={loading}>
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Settings</CardTitle>
                <CardDescription>
                  Manage your privacy preferences and account settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Communication Preferences</h3>
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="marketingConsent"
                      name="marketingConsent"
                      defaultChecked={user.marketingConsent}
                      className="mt-1"
                    />
                    <Label htmlFor="marketingConsent" className="text-sm font-normal">
                      I would like to receive updates and news about the Burton Latimer
                      Community
                    </Label>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold">Account Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Type:</span>
                      <span className="font-medium">{user.accountType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member Since:</span>
                      <span className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{user.email}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold">Data & Privacy</h3>
                  <p className="text-sm text-muted-foreground">
                    Your data is protected in accordance with GDPR regulations. You have
                    the right to request a copy of your data or request deletion of your
                    account.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline">Download My Data</Button>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
