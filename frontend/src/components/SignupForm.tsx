import type React from 'react';
import { Link, useFetcher, useNavigate } from 'react-router';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

// Custom modules
import { cn } from '@/lib/utils';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { InputPassword } from '@/components/InputPassword';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

// Assets
import { LoaderCircleIcon, Sparkles  } from 'lucide-react';

// Types
import type {
  ActionResponse,
  AuthResponse,
  ErrorResponse,
  ValidationError,
} from '@/types';
type SignupFieldName = 'email' | 'password' | 'role';

// Constants
const SIGNUP_FORM = {
  title: 'Create an account',
  description: 'Sign up to get started.',
  footerText: 'Already have an account?',
} as const;

// Signup form schema
const formSchema = z.object({
  email: z
    .string()
    .nonempty('Email is required')
    .max(50, 'Email must be less than 50 characters')
    .email('Invalid email address'),

  password: z
    .string()
    .nonempty('Password is required')
    .min(8, 'Password must be at least 8 characters long'),

  role: z.enum(['user', 'admin']),
});

export const SignupForm = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const signupResponse = fetcher.data as ActionResponse<AuthResponse>;

  const isLoading = fetcher.state !== 'idle';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'user',
    },
  });

  // Handle server error response
  useEffect(() => {
      if (!signupResponse) return;

      if (signupResponse.ok) {
          navigate('/', { viewTransition: true });
          return;
      }

      if (!signupResponse.err) return;

      if (signupResponse.err.code === 'AuthorizationError') {
        const authorizationError = signupResponse.err as ErrorResponse;

        toast.error(authorizationError.message, {
            position: 'top-center',
        });
      }
      if (signupResponse.err.code === 'ValidationError') {
        const validationErrors = signupResponse.err as ValidationError;

        Object.entries(validationErrors.errors).forEach((value) => {
            const [, validationError] = value;
            const signupField = validationError.path as SignupFieldName;

            form.setError(
                signupField,
                {
                    type: 'custom',
                    message: validationError.msg,
                },
                { shouldFocus: true },
            );
        });
      }
  }, [signupResponse, navigate, form]);

  // Handle Form Submission
  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    await fetcher.submit(values, {
      method: 'post',
      action: '/signup',
      encType: 'application/json',
    });
  }, []);

    return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="glass border-gradient shadow-glow rounded-3xl p-8">
        <div className="flex justify-center mb-4">
          <span
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl shadow-glow"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </span>
        </div>

        <h1 className="text-center font-sans text-3xl font-semibold tracking-tight text-foreground">
          {SIGNUP_FORM.title}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {SIGNUP_FORM.description}
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-3">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-2"
                    >
                      <Label
                        className={cn(
                          "h-11 w-full flex items-center justify-center rounded-xl text-sm font-medium cursor-pointer transition-colors leading-none",
                          field.value === 'user'
                            ? "text-white"
                            : "text-muted-foreground bg-muted/40"
                        )}
                        style={{
                          background: field.value === 'user' ? 'var(--gradient-primary)' : undefined,
                        }}
                      >
                        <RadioGroupItem value="user" className="absolute opacity-0 pointer-events-none" />
                        User
                      </Label>

                      <Label
                        className={cn(
                          "h-11 w-full flex items-center justify-center rounded-xl text-sm font-medium cursor-pointer transition-colors leading-none",
                          field.value === 'admin'
                            ? "text-white"
                            : "text-muted-foreground bg-muted/40"
                        )}
                        style={{
                          background: field.value === 'admin' ? 'var(--gradient-primary)' : undefined,
                        }}
                      >
                        <RadioGroupItem value="admin" className="absolute opacity-0 pointer-events-none" />
                        Admin
                      </Label>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      className="rounded-xl bg-muted/40 px-4 py-3 text-sm border-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputPassword
                      placeholder="Password"
                      className="rounded-xl bg-muted/40 px-4 py-3 text-sm border-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl py-3 text-sm font-medium text-primary-foreground shadow-glow hover:scale-[1.02] transition-transform disabled:opacity-60"
              style={{ background: "var(--gradient-primary)" }}
            >
              {isLoading && <LoaderCircleIcon className="animate-spin mr-2 w-4 h-4" />}
              Sign up
            </Button>
          </form>
        </Form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {SIGNUP_FORM.footerText}{' '}
          <Link to="/login" className="text-primary hover:underline" viewTransition>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
