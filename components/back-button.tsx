"use client";
import { useRouter } from "next/navigation";
import { buttonVariants } from "./ui/button";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export default function BackButton({
  className,
  variant = "secondary",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  const router = useRouter();
  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
      onClick={() => router.back()}
    >
      <ArrowLeft className="size-5" />
      Back
    </Comp>
  );
}
