"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation"; // ✅ Correct import

export const HomeView = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  if (!session) {
    return <p>Loading...</p>;
  }

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push("/sign-in"); // ✅ After successful sign-out
    } catch (error) {
      console.error("Sign-out failed:", error);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-y-4">
      <p>Logged in as {session.user.name}</p>
      <Button onClick={handleSignOut}>
        Sign Out
      </Button>
    </div>
  );
};
