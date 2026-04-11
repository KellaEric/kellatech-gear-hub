import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mt-16 gradient-primary py-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-black text-primary-foreground mb-2">Get in Touch</h1>
        <p className="text-primary-foreground/80">We'd love to hear from you. Contact us with any questions or inquiries.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Info */}
          <div className="bg-card border border-primary/10 rounded-xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-secondary">Contact Information</h2>
            {[
              { icon: MapPin, label: "Address", value: "Osu, Accra\nGhana" },
              { icon: Phone, label: "Phone", value: "+233 0201 926 457\n+233 0547 983 235" },
              { icon: Mail, label: "Email", value: "kellastechnology@gmail.com" },
              { icon: Clock, label: "Business Hours", value: "Mon–Fri: 9AM–6PM\nSat: 10AM–4PM\nSun: Closed" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-foreground text-sm">{label}</h3>
                </div>
                <p className="text-muted-foreground text-sm whitespace-pre-line pl-6">{value}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="bg-card border border-primary/10 rounded-xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-secondary mb-6">Send us a Message</h2>

            {submitted && (
              <div className="mb-4 p-3 rounded-lg bg-success/15 border border-success/30 text-success text-sm font-semibold text-center">
                ✓ Message sent successfully! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: "name", label: "Full Name", type: "text" },
                { name: "email", label: "Email Address", type: "email" },
                { name: "phone", label: "Phone Number", type: "tel" },
                { name: "subject", label: "Subject", type: "text" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-semibold text-foreground mb-1">{field.label} *</label>
                  <input
                    type={field.type}
                    required
                    value={formData[field.name as keyof typeof formData]}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    className="w-full px-4 py-3 bg-muted border border-primary/20 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-muted border border-primary/20 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-y"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 gradient-primary text-primary-foreground font-bold rounded-lg glow-primary hover:opacity-90 transition-all"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
