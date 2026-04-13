import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import logo from "@/assets/kella-logo.jpeg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
      toast({ title: "Check your email", description: "We sent you a password reset link." });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <Navbar />
      <div className="w-full max-w-md mt-16">
        <div className="text-center mb-8">
          <img src={logo} alt="KellasTech" className="w-16 h-16 rounded-xl mx-auto mb-4 object-cover" />
          <h1 className="text-2xl font-black text-foreground">Reset Password</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <div className="bg-card border border-primary/20 rounded-2xl p-6 sm:p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Email Sent!</h2>
              <p className="text-muted-foreground text-sm">
                Check your inbox at <span className="font-semibold text-foreground">{email}</span> for a password reset link.
              </p>
              <button onClick={() => setSent(false)}
                className="text-primary font-semibold text-sm hover:underline">
                Didn't receive it? Send again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-muted border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder="you@example.com" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 gradient-primary text-primary-foreground font-bold rounded-lg glow-primary hover:opacity-90 transition-all disabled:opacity-50">
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link to="/login" className="text-primary font-semibold hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
