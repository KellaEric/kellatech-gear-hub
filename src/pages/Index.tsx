import { Link } from "react-router-dom";
import { ArrowRight, Monitor, Cpu, Printer, Wifi, Laptop, Mouse, ShoppingCart, Package, Tag, Truck, CreditCard, Sparkles } from "lucide-react";
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
            <div className="flex justify-center items-end gap-3 sm:gap-5 mb-8 h-20">
              {[
                { Icon: ShoppingCart, delay: 0 },
                { Icon: Package, delay: 0.15 },
                { Icon: Tag, delay: 0.3 },
                { Icon: Sparkles, delay: 0.45 },
                { Icon: CreditCard, delay: 0.6 },
                { Icon: Truck, delay: 0.75 },
              ].map(({ Icon, delay }, i) => (
                <div
                  key={i}
                  className="relative ecom-icon"
                  style={{ animationDelay: `${delay}s, ${delay + 0.7}s` }}
                >
                  <span className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl ecom-pulse-ring" style={{ animationDelay: `${delay}s` }} />
                  <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 backdrop-blur-sm">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" strokeWidth={2.5} />
                  </div>
                </div>
              ))}
            </div>

            <div className="marquee-mask overflow-hidden mb-6 -mx-4 sm:-mx-6">
              <div className="marquee">
                {Array.from({ length: 6 }).map((_, i) => (
                  <h3
                    key={i}
                    className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground px-8 whitespace-nowrap"
                  >
                    Your All-in-One Technology Partner to build{" "}
                    <span className="text-gradient">next-generation Tech solutions and ecosystem</span>
                    <span className="text-primary mx-6">✦</span>
                  </h3>
                ))}
              </div>
            </div>

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
