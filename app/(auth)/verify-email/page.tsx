import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const VerifyEmail = () => {
  return (
    <div className="flex w-full h-screen flex-1 items-center justify-center p-4">
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mt-4">
            A verification link has been sent to your email address. Please
            check your inbox and spam folder, then click on the link to verify
            your email.
          </p>
        </CardContent>
        <CardFooter>
          <CardAction className="w-full">
            <Button className="float-right">Resend Email</Button>
          </CardAction>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmail;
