import { auth } from "@/auth";
import Header from "@/components/Header";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { after } from "next/server";
import * as React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  // Update last activity date
  after(async () => {
    if (!session?.user?.id) return;

    const today = new Date().toISOString().slice(0, 10);
    const [user] = await db
      .select({ lastActivityDate: users.lastActivityDate })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (user?.lastActivityDate === today) return;

    await db
      .update(users)
      .set({
        lastActivityDate: today,
      })
      .where(eq(users.id, session.user.id));
  });


  return (
    <main className="root-container">
      <div className="mx-auto max-w-7xl">
        <Header session={session} />
        <div className="mt-20 pb-20">{children}</div>
      </div>
    </main>
  );
};

export default layout;
