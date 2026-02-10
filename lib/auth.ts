import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production"
);

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token");

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token.value, secret);
    return payload as {
      userId: string;
      email: string;
      accountType: string;
    };
  } catch (error) {
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
