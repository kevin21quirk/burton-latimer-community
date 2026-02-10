"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function RegisterPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<string>("INDIVIDUAL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
      accountType: formData.get("accountType"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      dateOfBirth: formData.get("dateOfBirth"),
      phoneNumber: formData.get("phoneNumber"),
      address: formData.get("address"),
      city: formData.get("city") || "Burton Latimer",
      postcode: formData.get("postcode"),
      companyName: formData.get("companyName"),
      charityNumber: formData.get("charityNumber"),
      bio: formData.get("bio"),
      gdprConsent: formData.get("gdprConsent") === "on",
      marketingConsent: formData.get("marketingConsent") === "on",
    };

    if (!data.gdprConsent) {
      setError("You must accept the privacy policy and terms of service to register.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      router.push("/login?registered=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold">
            <div className="h-8 w-8 rounded-full bg-primary" />
            Burton Latimer Community
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription>
              Join the Burton Latimer Community and connect with your neighbors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="accountType">Account Type *</Label>
                <Select name="accountType" value={accountType} onValueChange={setAccountType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                    <SelectItem value="CHARITY">Charity</SelectItem>
                    <SelectItem value="COMPANY">Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" name="firstName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" name="lastName" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" name="email" type="email" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input id="password" name="password" type="password" required minLength={8} />
                <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input id="dateOfBirth" name="dateOfBirth" type="date" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" name="phoneNumber" type="tel" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" defaultValue="Burton Latimer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input id="postcode" name="postcode" />
                </div>
              </div>

              {accountType === "COMPANY" && (
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" name="companyName" />
                </div>
              )}

              {accountType === "CHARITY" && (
                <div className="space-y-2">
                  <Label htmlFor="charityNumber">Charity Registration Number</Label>
                  <Input id="charityNumber" name="charityNumber" />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="gdprConsent"
                    name="gdprConsent"
                    className="mt-1"
                    required
                  />
                  <Label htmlFor="gdprConsent" className="text-sm font-normal">
                    I accept the{" "}
                    <Link href="/privacy" className="text-primary underline">
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link href="/terms" className="text-primary underline">
                      Terms of Service
                    </Link>
                    . I understand my data will be processed in accordance with GDPR. *
                  </Label>
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="marketingConsent"
                    name="marketingConsent"
                    className="mt-1"
                  />
                  <Label htmlFor="marketingConsent" className="text-sm font-normal">
                    I would like to receive updates and news about the Burton Latimer Community
                    (optional)
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary underline">
                  Login here
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
