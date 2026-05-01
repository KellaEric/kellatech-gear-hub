import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import logo from "@/assets/kella-logo.jpeg";

const Signup = () => {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    country: "",
    company: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast({ title: "Password too short", description: "Use at least 8 characters.", variant: "destructive" });
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          username: form.username,
          phone: form.phone,
          country: form.country,
          company: form.company,
        },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: "We sent you a verification link to confirm your account." });
      navigate("/login");
    }
  };

  const handleGoogleSignup = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast({ title: "Google signup failed", description: String(result.error), variant: "destructive" });
    }
    if (result.redirected) return;
    navigate("/");
  };

  const inputClass =
    "w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm";

  const labelClass = "block text-sm font-bold text-foreground mb-2";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="px-4 py-8 sm:py-12 flex items-center justify-center">
        <div className="w-full max-w-2xl mt-16">
          <div className="text-center mb-8">
            <img src={logo} alt="KellasTech" className="w-14 h-14 rounded-xl mx-auto mb-4 object-cover" />
            <h1 className="text-3xl sm:text-4xl font-black text-foreground">Create Account</h1>
            <p className="text-muted-foreground text-sm mt-2">Sign up to get started</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    className={inputClass}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className={labelClass}>Username</label>
                  <input
                    type="text"
                    required
                    value={form.username}
                    onChange={(e) => update("username", e.target.value)}
                    className={inputClass}
                    placeholder="johndoe"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={inputClass}
                  placeholder="john@example.com"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className={inputClass}
                    placeholder="+1234567890"
                  />
                </div>
                <div>
                  <label className={labelClass}>Country</label>
                  <input
                    type="text"
                    required
                    value={form.country}
                    onChange={(e) => update("country", e.target.value)}
                    className={inputClass}
                    placeholder="Ghana"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Company</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                  className={inputClass}
                  placeholder="Your Company Name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    className={inputClass}
                    placeholder="Min. 8 characters"
                  />
                </div>
                <div>
                  <label className={labelClass}>Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={form.confirmPassword}
                    onChange={(e) => update("confirmPassword", e.target.value)}
                    className={inputClass}
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 gradient-primary text-primary-foreground font-bold rounded-xl glow-primary hover:opacity-90 transition-all disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-3 text-muted-foreground">or</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignup}
              className="w-full py-3 border border-border rounded-lg text-foreground font-semibold hover:bg-muted transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
