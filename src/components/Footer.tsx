import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Globe } from "lucide-react";

const Footer = () => (
  <footer className="bg-background border-t border-primary/20 mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-black text-foreground mb-3">
            KELLA<span className="text-gradient">STECH</span>
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your All-in-One Technology Partner. Computers, accessories, networking tools, and IT services in Ghana.
          </p>
        </div>

        <div>
          <h4 className="text-primary font-semibold mb-3">Quick Links</h4>
          <div className="space-y-2">
            {[
              { label: "Home", to: "/" },
              { label: "Shop", to: "/shop" },
              { label: "About Us", to: "/about" },
              { label: "Contact", to: "/contact" },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-primary font-semibold mb-3">Categories</h4>
          <div className="space-y-2">
            {["Laptops", "Desktops", "Monitors", "Printers", "Accessories", "Networking"].map((c) => (
              <Link key={c} to={`/shop?category=${c}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                {c}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-primary font-semibold mb-3">Contact</h4>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> 0201926457 / 0547983235</p>
            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> kellastechnology@gmail.com</p>
            <p className="flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> dev-kellatech.pantheonsite.io</p>
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Accra, Ghana</p>
          </div>
        </div>
      </div>

      <div className="border-t border-primary/10 pt-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} KELLASTECH. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
