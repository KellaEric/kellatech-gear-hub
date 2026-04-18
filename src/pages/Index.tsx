import { Link } from "react-router-dom";
import { ArrowRight, Monitor, Cpu, Printer, Wifi, Laptop, Mouse } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import { useProducts } from "@/data/products";

const categoryDefs = [
  { name: "Laptops", icon: Laptop },
  { name: "Desktops", icon: Cpu },
  { name: "Monitors", icon: Monitor },
  { name: "Printers", icon: Printer },
  { name: "Accessories", icon: Mouse },
  { name: "Networking", icon: Wifi },
];

const Index = () => {
  const { data: products = [] } = useProducts();
  const featured = products.filter((p) => p.badge).slice(0, 8);
  const showcase = (featured.length > 0 ? featured : products).slice(0, 6);

  const categoryIcons = categoryDefs.map((c) => ({
    ...c,
    count: products.filter((p) => p.category === c.name).length,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative mt-16 min-h-[80vh] sm:min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,hsl(18_100%_57%_/_0.08),transparent_50%),radial-gradient(circle_at_80%_80%,hsl(18_100%_57%_/_0.05),transparent_50%)]" />
        <div className="absolute -top-1/2 -right-[10%] w-[600px] h-[600px] bg-gradient-to-br from-primary/15 to-secondary/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary font-semibold text-sm px-5 py-2 rounded-full mb-6">
              📍 Based in Ghana — Serving All of Africa
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-foreground leading-[1.1] mb-6">
              <span className="inline-block opacity-0 animate-[fade-in_0.8s_ease-out_0.1s_forwards]">Your</span>{" "}
              <span className="inline-block opacity-0 animate-[fade-in_0.8s_ease-out_0.25s_forwards]">All-in-One</span>{" "}
              <span className="inline-block opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards]">Technology</span>{" "}
              <span className="inline-block opacity-0 animate-[fade-in_0.8s_ease-out_0.55s_forwards]">Partner</span>{" "}
              <span className="inline-block opacity-0 animate-[fade-in_0.8s_ease-out_0.7s_forwards]">to</span>{" "}
              <span className="inline-block opacity-0 animate-[fade-in_0.8s_ease-out_0.85s_forwards]">build</span>{" "}
              <span className="text-gradient inline-block opacity-0 animate-[fade-in_1s_ease-out_1.1s_forwards] bg-[length:200%_auto] animate-[fade-in_1s_ease-out_1.1s_forwards,shimmer_3s_ease-in-out_2s_infinite]">
                next-generation Tech solutions and ecosystem
              </span>
            </h1>

            <div className="max-w-3xl mx-auto bg-card/50 border border-primary/20 rounded-xl p-6 backdrop-blur-sm mb-8">
              <p className="text-lg sm:text-xl text-foreground font-semibold mb-3">Computers &amp; Accessories Store</p>
              <p className="text-muted-foreground leading-relaxed">
                Shop laptops, desktops, monitors, printers, computer parts, accessories, and networking tools — all at competitive prices in Ghana Cedis.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {["Laptops & Desktops", "IT Support", "Hardware Repairs", "CCTV Installation"].map((point) => (
                <span key={point} className="flex items-center gap-2 text-foreground font-semibold">
                  <span className="text-accent text-lg">→</span> {point}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 gradient-primary text-primary-foreground font-bold rounded-lg glow-primary hover:opacity-90 transition-all text-lg">
                Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 bg-foreground/10 border-2 border-foreground/30 text-foreground font-bold rounded-lg hover:bg-primary/20 hover:border-primary transition-all text-lg">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Slow-mo featured carousel */}
      <FeaturedCarousel products={showcase} />

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-3">Shop by Category</h2>
          <p className="text-muted-foreground">Find exactly what you need</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoryIcons.map(({ name, icon: Icon, count }) => (
            <Link key={name} to={`/shop?category=${name}`} className="bg-card border border-primary/10 rounded-xl p-6 text-center card-hover group">
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-foreground text-sm mb-1">{name}</h3>
              <p className="text-xs text-muted-foreground">{count} products</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-2">Featured Products</h2>
            <p className="text-muted-foreground">Top picks from our store</p>
          </div>
          <Link to="/shop" className="hidden sm:inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
        <div className="sm:hidden text-center mt-8">
          <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-primary-foreground font-semibold rounded-lg">
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Services Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="gradient-primary rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-primary-foreground mb-4">Need IT Services?</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-6">
            Beyond selling hardware, we offer Software Development, IT Support, Mentoring, Hardware Repairs, CCTV Camera Installation, and more.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3 bg-background text-primary font-bold rounded-lg hover:bg-foreground hover:text-background transition-all">
            Get in Touch <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
