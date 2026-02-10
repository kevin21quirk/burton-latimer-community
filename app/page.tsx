import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, Building2, MessageCircle, Calendar, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary" />
            <span className="text-xl font-bold">Burton Latimer Community</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="bg-gradient-to-b from-white to-muted py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-6xl">
              Welcome to <span className="text-accent">Burton Latimer</span> Community
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
              A social platform bringing together individuals, charities, and businesses 
              to support and connect with our local community.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-4xl font-bold">How It Works</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                    <Users className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <CardTitle>Create Your Profile</CardTitle>
                  <CardDescription>
                    Register as an individual, charity, or business. Share your story and connect with neighbors.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                    <MessageCircle className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <CardTitle>Connect & Share</CardTitle>
                  <CardDescription>
                    Post updates, share photos, ask for help, or advertise your services to the community.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                    <Heart className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <CardTitle>Support Each Other</CardTitle>
                  <CardDescription>
                    Join groups, message neighbors, and help vulnerable members of our community.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-muted py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-4xl font-bold">Platform Features</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <Users className="mb-2 h-8 w-8 text-accent" />
                  <CardTitle>Social Feed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Stay updated with posts from your neighbors, local businesses, and community organizations.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Building2 className="mb-2 h-8 w-8 text-accent" />
                  <CardTitle>Business Advertising</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Local businesses can promote their services and connect with potential customers.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Heart className="mb-2 h-8 w-8 text-accent" />
                  <CardTitle>Help Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Ask for assistance or offer help to vulnerable community members.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <MessageCircle className="mb-2 h-8 w-8 text-accent" />
                  <CardTitle>Direct Messaging</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Connect privately with other members through our secure messaging system.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Calendar className="mb-2 h-8 w-8 text-accent" />
                  <CardTitle>Community Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Join or create groups based on interests, neighborhoods, or causes.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Shield className="mb-2 h-8 w-8 text-accent" />
                  <CardTitle>GDPR Compliant</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your data is protected and managed in accordance with GDPR regulations.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-4xl font-bold">Join Our Community Today</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Whether you're an individual looking to connect, a charity seeking support, 
              or a business wanting to reach local customers, Burton Latimer Community is here for you.
            </p>
            <Link href="/register">
              <Button size="lg">Create Your Account</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-muted py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Burton Latimer Community. All rights reserved.</p>
          <div className="mt-4 flex justify-center gap-6">
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
