import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart, Menu, X, User, LogOut, Shield } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/kella-logo.jpeg";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const { data: isAdmin } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-primary/20 animate-slide-down">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="KellasTech" className="w-10 h-10 rounded-lg object-cover" />
          <span className="text-xl font-black text-foreground tracking-tight">
            KELLA<span className="text-gradient">STECH</span>
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`font-semibold text-sm transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-primary after:transition-all ${
                  location.pathname === link.to
                    ? "text-primary after:w-full"
                    : "text-muted-foreground hover:text-primary after:w-0 hover:after:w-full"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 gradient-primary rounded-full text-[10px] font-bold flex items-center justify-center text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              {isAdmin && (
                <Link to="/admin"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/50 text-sm font-semibold text-primary hover:bg-primary/10 transition-all">
                  <Shield className="w-4 h-4" /> Admin
                </Link>
              )}
              <button onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/50 text-sm font-semibold text-muted-foreground hover:bg-primary/10 hover:border-primary hover:text-foreground transition-all">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/50 text-sm font-semibold text-muted-foreground hover:bg-primary/10 hover:border-primary hover:text-foreground transition-all">
                <User className="w-4 h-4" /> Login
              </Link>
              <Link to="/signup"
                className="hidden md:inline-flex px-4 py-2 rounded-lg gradient-primary text-sm font-semibold text-primary-foreground glow-primary hover:opacity-90 transition-all">
                Sign Up
              </Link>
            </>
          )}

          <button className="md:hidden p-2 text-primary" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-card border-t border-primary/20 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
              className={`block py-2 font-semibold ${location.pathname === link.to ? "text-primary" : "text-muted-foreground"}`}>
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)}
                    className="block py-2 font-semibold text-primary">
                    <Shield className="w-4 h-4 inline mr-1" /> Admin
                  </Link>
                )}
                <button onClick={() => { handleSignOut(); setMobileOpen(false); }}
                  className="flex-1 text-center py-2 rounded-lg border border-primary/50 text-sm font-semibold text-muted-foreground">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 rounded-lg border border-primary/50 text-sm font-semibold text-muted-foreground">Login</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 rounded-lg gradient-primary text-sm font-semibold text-primary-foreground">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
