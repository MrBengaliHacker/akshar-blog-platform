import { useEffect } from "react";
import { useFetcher } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

// Custom Modules
import { cn, getErrorMessage } from "@/lib/utils";
import { aksharApi } from "@/api";

// Components
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/InputPassword";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Custom Hooks
import { useUser } from '@/hooks/useUser';

// Assets
import { AtSignIcon, Loader2Icon, MailIcon } from "lucide-react";


// Types

import type { DialogProps } from "@radix-ui/react-dialog";
import type { ActionResponse, ValidationError } from "@/types";


// Profile Form Schema
const profileFormSchema = z.object({
  firstName: z.string().max(20, "First name must be less than 20 characters").optional(),
  lastName: z.string().max(20, "Last name must be less than 20 characters").optional(),
  email: z
    .string()
    .max(50, "Email must be less than 50 characters")
    .email("Invalid email address").optional(),
  username: z.string().max(20, "Username must be less than 20 characters").optional(),
});

type ProfileFieldName = keyof z.infer<typeof profileFormSchema>;

const ProfileSettingsForm = () => {
  const fetcher = useFetcher();
  const user = useUser();
  const data = fetcher.data as ActionResponse | undefined;

  const loading = fetcher.state !== "idle";

  // React Hook Form Initial
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: user?.email,
      username: user?.username,
    },
  });

  // Load the saved profile (first and last name are not kept in localStorage)
  useEffect(() => {
    aksharApi
      .get("/users/current")
      .then(({ data }) => {
        form.reset({
          firstName: data.user.firstName ?? "",
          lastName: data.user.lastName ?? "",
          email: data.user.email,
          username: data.user.username,
        });
      })
      .catch(() => {});
  }, [form]);

  // Handle server response
  useEffect(() => {
    if (!data) return;

    if (data.ok) {
      toast.success("Profile has been updated successfully");
      return;
    }

    if (data.err?.code === "ValidationError") {
      const validationErrors = data.err as ValidationError;

      Object.values(validationErrors.errors).forEach((validationError) => {
        form.setError(validationError.path as ProfileFieldName, {
          type: "custom",
          message: validationError.msg,
        });
      });
      return;
    }

    toast.error(getErrorMessage(data.err));
  }, [data, form]);

  // Handle form submission
  const onSubmit = (values: z.infer<typeof profileFormSchema>) => {
    fetcher.submit(values, {
      action: "/settings",
      method: "post",
      encType: "application/json",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <h3 className="font-semibold text-lg">Personal info</h3>

          <p className="text-sm text-muted-foreground">
            Update your photo and personal details here.
          </p>

          <Separator className="my-5" />
        </div>

        <div className="grid gap-4 items-start lg:grid-cols-[1fr_2fr]">
          <div
            className={cn(
              "text-sm leading-none font-medium",
              (form.formState.errors.firstName ||
                form.formState.errors.lastName) &&
                "text-destructive"
            )}
          >
            Name
          </div>

          <div className="grid max-md:gap-y-4 gap-x-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="md:sr-only">First name</FormLabel>

                  <FormControl>
                    <Input type="text" placeholder="John" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="md:sr-only">Last name</FormLabel>

                  <FormControl>
                    <Input type="text" placeholder="Doe" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator className="my-5" />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid gap-2 items-start lg:grid-cols-[1fr_2fr]">
              <FormLabel >Email Address</FormLabel>

              <div className="space-y-2">
                <div className="relative">
                  <MailIcon
                    size={20}
                    className="absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none text-muted-foreground"
                  />

                  <FormControl>
                    <Input type="email" placeholder="John@example.com" className="ps-10" {...field} />
                  </FormControl>
                </div>

                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Separator className="my-5" />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="grid gap-2 items-start lg:grid-cols-[1fr_2fr]">
              <FormLabel >Username</FormLabel>

              <div className="space-y-2">
                <div className="relative">
                  <AtSignIcon
                    size={20}
                    className="absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none text-muted-foreground"
                  />

                  <FormControl>
                    <Input type="text" placeholder="johndoe" className="ps-10" {...field} />
                  </FormControl>
                </div>

                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Separator className="my-5" />

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            asChild
          >
            <DialogClose>Cancel</DialogClose>
          </Button>

          <Button type="submit" disabled={loading}>
            {loading && <Loader2Icon className="animate-spin" />}

            {loading ? 'Saving' : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

// Password Form Schema
const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords doesn't match",
    path: ["confirm_password"],
  });

type PasswordFieldName = keyof z.infer<typeof passwordFormSchema>;

const PasswordSettingsForm = () => {
  const fetcher = useFetcher();
  const data = fetcher.data as ActionResponse | undefined;

  const loading = fetcher.state !== "idle";

  // React Hook Form Initial
  const form = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirm_password: "",
    },
  });

  // Handle server response
  useEffect(() => {
    if (!data) return;

    if (data.ok) {
      toast.success("Password has been updated successfully");
      form.reset();
      return;
    }

    if (data.err?.code === "ValidationError") {
      const validationErrors = data.err as ValidationError;

      Object.values(validationErrors.errors).forEach((validationError) => {
        form.setError(validationError.path as PasswordFieldName, {
          type: "custom",
          message: validationError.msg,
        });
      });
      return;
    }

    toast.error(getErrorMessage(data.err));
  }, [data, form]);

  // Handle form submission (confirm_password is only for the form, not sent)
  const onSubmit = (values: z.infer<typeof passwordFormSchema>) => {
    fetcher.submit(
      { currentPassword: values.currentPassword, password: values.password },
      {
        action: "/settings",
        method: "post",
        encType: "application/json",
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <h3 className="font-semibold text-lg">Password</h3>

          <p className="text-sm text-muted-foreground">
            Please enter your current password to change your password.
          </p>

          <Separator className="my-5" />
        </div>

        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem className="grid gap-2 items-start lg:grid-cols-[1fr_2fr]">
              <FormLabel >Current Password</FormLabel>

              <div className="space-y-2">

                <FormControl>
                  <InputPassword placeholder="••••••••" {...field} />
                </FormControl>

                <FormMessage />
                </div>
            </FormItem>
          )}
        />
        <Separator className="my-5" />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid gap-2 items-start lg:grid-cols-[1fr_2fr]">
              <FormLabel >New Password</FormLabel>

              <div className="space-y-2">

                <FormControl>
                  <InputPassword placeholder="••••••••" {...field} />
                </FormControl>

                <FormMessage />
                </div>
            </FormItem>
          )}
        />
        <Separator className="my-5" />

        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem className="grid gap-2 items-start lg:grid-cols-[1fr_2fr]">
              <FormLabel >Confirm new password</FormLabel>

              <div className="space-y-2">

                <FormControl>
                  <InputPassword placeholder="••••••••" {...field} />
                </FormControl>

                <FormMessage />
                </div>
            </FormItem>
          )}
        />

        <Separator className="my-5" />

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            asChild
          >
            <DialogClose>Cancel</DialogClose>
          </Button>

          <Button type="submit" disabled={loading}>
            {loading && <Loader2Icon className="animate-spin" />}

            {loading ? 'Updating' : "Update password"}
          </Button>
        </div>
      </form>
    </Form>
  )
};

export const SettingsDialog = ({
  children,
  ...props
}: React.PropsWithChildren<DialogProps>) => {
  return (
    <Dialog {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="md:min-w-[80vw] xl:min-w-[44xl]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Settings</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="profile"
          className="gap-5"
        >
          <TabsList className="w-full">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileSettingsForm />
          </TabsContent>

          <TabsContent value="password">
            <PasswordSettingsForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};