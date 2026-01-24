"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/app/schemas/authSchema";
import { signUpAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterPage({
  ...props
}: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const { handleSubmit, register } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    const result = await signUpAction(data);
    if (result.success) {
      router.push("/verify-email");
      toast.success("Account created successfully!");
    } else {
      toast.error("Failed to create account. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <Card {...props}>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>
                <Input id="confirm-password" type="password" />
                <FieldDescription>
                  Please confirm your password.
                </FieldDescription>
              </Field>
              <FieldGroup>
                <Field>
                  <Button type="submit">Create Account</Button>
                  <Button variant="outline" type="button">
                    Sign up with Google
                  </Button>
                  <FieldDescription className="px-6 text-center">
                    Already have an account?
                    <Link href="/login">Sign in</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
