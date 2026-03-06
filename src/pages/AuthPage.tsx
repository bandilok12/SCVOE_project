import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';

/* ===================== VALIDATION ===================== */
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, signUp, loading } = useAuth();

  const [isSignup, setIsSignup] = useState(
    searchParams.get('mode') === 'signup'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ===================== HANDLERS ===================== */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      if (isSignup) {
        const result = signupSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach(err => {
            fieldErrors[String(err.path[0])] = err.message;
          });
          setErrors(fieldErrors);
          return;
        }

        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.name
        );

        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success('Account created successfully!');
        navigate('/', { replace: true }); // ✅ SINGLE SOURCE OF REDIRECT
      } else {
        const result = loginSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach(err => {
            fieldErrors[String(err.path[0])] = err.message;
          });
          setErrors(fieldErrors);
          return;
        }

        const { error } = await signIn(
          formData.email,
          formData.password
        );

        if (error) {
          toast.error('Invalid email or password');
          return;
        }

        toast.success('Welcome back!');
        navigate('/', { replace: true }); // ✅ SINGLE SOURCE OF REDIRECT
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ===================== LOADING ===================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ===================== UI ===================== */
  return (
    <div className="min-h-screen flex">
      {/* LEFT */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center shadow-soft">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">AgroSmart</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
            {isSignup && (
              <div>
                <Label>Full Name</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <p className="text-destructive">{errors.name}</p>}
              </div>
            )}

            <div>
              <Label>Email</Label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-destructive">{errors.email}</p>}
            </div>

            <div>
              <Label>Password</Label>
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="text-destructive">{errors.password}</p>}
            </div>

            <Button className="w-full" disabled={submitting}>
              {submitting
                ? 'Please wait...'
                : isSignup
                ? 'Create Account'
                : 'Sign In'}
            </Button>
          </form>

          <p className="mt-6 text-center">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="ml-2 text-primary"
            >
              {isSignup ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12 relative overflow-hidden"> 
        <div className="text-center relative z-10"> 
          <div className="w-24 h-24 rounded-full bg-primary-foreground/10 flex items-center justify-center mx-auto mb-6 animate-float"> 
          <Leaf className="w-12 h-12 text-primary-foreground" /> </div>
           <h2 className="text-3xl font-bold text-primary-foreground mb-4"> Grow Smarter, Not Harder </h2> 
           <p className="text-primary-foreground/80 max-w-md"> AI-powered insights, real-time analytics, and quality products—all designed to help you succeed. </p> 
           </div> 
           {/* Decorative elements */}
            <div className="absolute top-20 left-20 w-40 h-40 bg-primary-foreground/5 rounded-full blur-2xl" /> 
            <div className="absolute bottom-20 right-20 w-60 h-60 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" /> 
            </div> 
            </div>
    
  );
};

export default AuthPage;
