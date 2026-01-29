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
import { useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/app/schemas/authSchema";
import z from "zod";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEmailPending, startEmailTransition] = useTransition();

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /* Sign in with Google */
  const signIn = () => {
    startTransition(async () => {
      await authClient.signIn.social(
        {
          provider: "google",
          callbackURL: "/",
        },
        {
          onError: (error) => {
            toast.error(`Error signing in: ${error.error.message}`);
          },
        },
      );
    });
  };

  // sign in with email and password
  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    startEmailTransition(async () => {
      const { data, error } = await authClient.signIn.email(
        {
          email: values.email,
          password: values.password,
          callbackURL: "/",
        },
        {
          onSuccess: () => {
            router.push("/");
            toast.success("Signed In Successfully.");
          },
        },
      );

      if (error) {
        toast.error(error.message);
        if (error.status === 403 && error.code === "EMAIL_NOT_VERIFIED") {
          router.push("/verify-email");
          return;
        }
      }
    });
  };
  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
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
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isEmailPending || isPending}>
                  {isEmailPending && <Loader className="animate-spin" />}
                  Login
                </Button>

                <Separator className="my-3" />
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => signIn()}
                  disabled={isPending || isEmailPending}
                >
                  {isPending && <Loader className="animate-spin" />} Continue
                  with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?
                  <Link href="/register">Register</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
