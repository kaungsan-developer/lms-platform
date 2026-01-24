"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BadgeCheckIcon,
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
} from "lucide-react";
import { signOutAction } from "@/app/actions";
import { toast } from "sonner";
import Link from "next/link";

export function DropdownMenuAvatar({
  user,
}: {
  user: { name: string; email: string };
}) {
  const signOut = async () => {
    await signOutAction()
      .then(() => {
        toast.success("Signed out successfully");
      })
      .catch(() => {
        toast.error("Error signing out");
      });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage src="" alt="shadcn" />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-70">
        <DropdownMenuGroup className="space-y-2.5">
          <DropdownMenuItem disabled>{user.name}</DropdownMenuItem>
          <DropdownMenuItem disabled>{user.email}</DropdownMenuItem>
          <DropdownMenuItem>
            <BadgeCheckIcon />
            <Link href="/">Home</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCardIcon />
            <Link href="/dashboard">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BellIcon />
            <Link href="/courses">Courses</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BellIcon />
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => signOut()}>
          <LogOutIcon />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
