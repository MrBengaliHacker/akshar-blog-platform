import type React from 'react';
import { Link, useFetcher, useNavigate } from 'react-router';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

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

// Assets
import { LoaderCircleIcon, Sparkles} from 'lucide-react';

// Types
import type { ActionResponse, AuthResponse, ValidationError } from '@/types'
type LoginFieldName = 'email' | 'password';

// Constants
const LOGIN_FORM = {
  title: 'Welcome back',
  description: 'Sign in to continue reading.',
  footerText: 'New to Akshar?',
} as const;

// Login form schema
const formSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .max(50, "Email must be less than 50 characters")
    .email("Invalid email address"),

  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

export const LoginForm = ({ 
  className, 
  ...props 
}: React.ComponentProps<'div'>) => {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const loginResponse = fetcher.data as ActionResponse<AuthResponse>;
  const isLoading = fetcher.state !== 'idle';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Handle server error response
  useEffect(() => {
      if (!loginResponse) return;

      if (loginResponse.ok) {
          navigate('/', { viewTransition: true });
          return;
      }

      if (!loginResponse.err) return;

      if (loginResponse.err.code === 'ValidationError') {
        const validationErrors = loginResponse.err as ValidationError;

        Object.entries(validationErrors.errors).forEach((value) => {
            const [, validationError] = value;
            const loginField = validationError.path as LoginFieldName;

            form.setError(
                loginField,
                {
                    type: 'custom',
                    message: validationError.msg,
                },
                { shouldFocus: true },
            );
        });
      }
  }, [loginResponse, navigate, form]);
  
  // Handle Form Submission
  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
      await fetcher.submit(values, {
        method: 'post',
        action: '/login',
        encType: 'application/json',
      });
  },[]);

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
          {LOGIN_FORM.title}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {LOGIN_FORM.description}
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-3">
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
              Sign in
            </Button>
          </form>
        </Form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {LOGIN_FORM.footerText}{' '}
          <Link to="/signup" className="text-primary hover:underline" viewTransition>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}


