import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const emailSignupSchema = z.object({
  email: z.string().email(),
  name: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { email, name } = emailSignupSchema.parse(body);

    // TODO: Integrate with your email service provider (e.g., Mailchimp, SendGrid, etc.)
    // For now, we'll just log it
    console.log(`Email signup: ${name} (${email}) signed up for notifications`);

    // Example integration with a hypothetical email service:
    // await emailService.addSubscriber({
    //   email,
    //   name,
    //   tags: ['community-updates'],
    // });

    return NextResponse.json({ 
      success: true, 
      message: "Successfully signed up for email notifications" 
    });
  } catch (error) {
    console.error("Email signup error:", error);
    return NextResponse.json(
      { error: "Failed to sign up for email notifications" },
      { status: 500 }
    );
  }
}
