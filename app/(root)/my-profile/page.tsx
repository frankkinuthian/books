import * as React from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";
import BookList from "@/components/BookList";
import { sampleBooks } from "@/constants";

const Page = () => {
  return (
    <>
      {/* Form uses a server action: submit triggers the async function on the server */}
      <form
        action={async () => {
          "use server";

          // Sign-out logic is executed on the server when the form submits
          await signOut({ redirectTo: "/sign-in" });
        }}
        className="mb-10"
      >
        <Button type="submit">Logout</Button>
      </form>

      <BookList title="Borrowed Books" books={sampleBooks} />
    </>
  );
};
export default Page;
