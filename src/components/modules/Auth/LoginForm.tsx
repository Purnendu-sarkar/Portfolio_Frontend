"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import Password from "@/components/ui/Password";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (values: LoginFormValues) => {
    const res = await signIn("credentials", {
      ...values,
      redirect: false, 
    });

    if (res?.error) {
      toast.error("Invalid credentials");
    } else {
      toast.success("Login successful 🎉");
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
          <CardHeader className="text-center">
            <Image
              src="/logo_dark.png"
              alt="Logo"
              width={50}
              height={50}
              className="mx-auto mb-2"
            />
            <CardTitle className="text-2xl font-semibold">
              Welcome Back 👋
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Please login to access your dashboard
            </p>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Email:</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Write Admin Email Address"
                          className="focus-visible:ring-2 focus-visible:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Password:</FormLabel>
                      <FormControl>
                        <Password {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                >
                  Login
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
