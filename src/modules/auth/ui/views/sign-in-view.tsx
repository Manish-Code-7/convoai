"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {FaGithub, FaGoogle} from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { OctagonAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is Required" }),
});

export const SignInView = () => {
    const router = useRouter();
    const [error, setError] =useState<string | null>(null);
    const [pending, setPending]=useState(false);
  
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data : z.infer<typeof formSchema>)=>{
    setError(null);
    setPending(true);
    authClient.signIn.email(
        {
            email: data.email,
            password: data.password,
            callbackURL:"/"
        },
        {
            onSuccess: ()=>{
                setPending(false);
                router.push("/");
            },
            onError: ({error})=>{
                setPending(false);
                setError(error.message)
            }
        }
    );
    
  }
  const onSocial = (provider:"github" | "google") => {
    setError(null);
    setPending(true);

    authClient.signIn.social(
      {
        provider:provider,
        callbackURL:"/"
      },
      {
        onSuccess: () => {
          setPending(false);
        },
        onError: ({ error }) => {
          setPending(false);
          setError(error.message);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit((onSubmit))}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-balance">
                    Login to your account
                  </p>
                </div>

                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="m@example.com"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="*******"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Temporary hardcoded error for visual testing */}
                {!!error && (
                  <Alert className="bg-destructive/10 border-none">
                    <OctagonAlertIcon className="h-4 w-4 text-destructive" />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={pending}>
                  Sign In
                </Button>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" type="button" className="w-full" disabled={pending} 
                  onClick={()=>{onSocial("github")}}>
                   <FaGithub />
                  </Button>
                  <Button variant="outline" type="button" className="w-full" disabled={pending}
                  onClick={()=>{onSocial("google")}}>
                    <FaGoogle />
                  </Button>
                </div>

                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/sign-up" className="text-primary underline">
                    Sign Up
                  </Link>
                </div>
              </div>
            </form>
          </Form>

          <div className="bg-radial from-sidebar-accent to-sidebar relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <img src="/logo.svg" alt="Image" className="h-[92px] w-[92px]" />
            <p className="text-2xl font-semibold text-white">convoai</p>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]hover:text-primary text-center text-xs text-balance *:[a]:underline-offset-4">
            By clicking continue, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
       </div>
    </div>
  );
};
