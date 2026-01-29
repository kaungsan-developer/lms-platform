"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { DropdownMenuAvatar } from "./DropdownMenuAvatar";

import { authClient } from "@/lib/auth-client";

const navbarItems = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Admin", href: "/admin" },
];
const NavBar = () => {
  // const session = await authClient.getSession();
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  return (
    <div className="sticky px-10 py-3 border-b bg-background/90 backdrop-blur-sm top-0 z-50">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">LMS</h1>
        <nav className="hidden md:flex lg:flex gap-6 items-center">
          {navbarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={buttonVariants({ variant: "ghost" })}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <nav className="flex gap-4 items-center">
          <ModeToggle />
          {session ? (
            <DropdownMenuAvatar user={session.user} />
          ) : (
            <Link
              href="/login"
              className={buttonVariants({ variant: "secondary" })}
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
