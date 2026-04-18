import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import type { Product } from "@/data/products";

interface FeaturedCarouselProps {
  products: Product[];
  intervalMs?: number;
}

const FeaturedCarousel = ({ products, intervalMs = 6000 }: FeaturedCarouselProps) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || products.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % products.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [paused, products.length, intervalMs]);

  if (products.length === 0) return null;

  const go = (dir: number) =>
    setIndex((i) => (i + dir + products.length) % products.length);

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary font-semibold text-xs px-4 py-1.5 rounded-full mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Highlighted
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-2">High-Featured Products</h2>
        <p className="text-muted-foreground">A curated showcase of our best gear</p>
      </div>

      <div
        className="relative rounded-3xl overflow-hidden border border-primary/20 bg-card shadow-2xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Slides */}
        <div className="relative h-[420px] sm:h-[480px] md:h-[520px]">
          {products.map((p, i) => {
            const active = i === index;
            return (
              <div
                key={p.id}
                className={`absolute inset-0 transition-all duration-[1800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  active ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
                aria-hidden={!active}
              >
                {/* Background image with slow zoom */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={p.image}
                    alt=""
                    className={`w-full h-full object-cover transition-transform ${
                      active ? "duration-[8000ms] scale-110" : "duration-[1800ms] scale-100"
                    } ease-out`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 grid md:grid-cols-2 h-full">
                  <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-16">
                    {p.badge && (
                      <span
                        className={`self-start inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary font-bold text-xs px-3 py-1.5 rounded-full mb-4 transition-all duration-1000 ${
                          active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        }`}
                      >
                        {p.badge}
                      </span>
                    )}
                    <h3
                      className={`text-2xl sm:text-3xl lg:text-5xl font-black text-foreground leading-tight mb-3 line-clamp-3 transition-all duration-[1200ms] delay-150 ${
                        active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                      }`}
                    >
                      {p.name}
                    </h3>
                    <p
                      className={`text-muted-foreground mb-5 max-w-md line-clamp-3 transition-all duration-[1200ms] delay-300 ${
                        active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                      }`}
                    >
                      {p.description}
                    </p>
                    <div
                      className={`flex items-baseline gap-3 mb-6 transition-all duration-[1200ms] delay-[450ms] ${
                        active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                      }`}
                    >
                      <span className="text-3xl font-black text-gradient">
                        GH₵{p.price.toLocaleString()}
                      </span>
                      {p.original_price && (
                        <span className="text-base text-muted-foreground line-through">
                          GH₵{p.original_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div
                      className={`flex flex-wrap gap-3 transition-all duration-[1200ms] delay-[600ms] ${
                        active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                      }`}
                    >
                      <Link
                        to={`/product/${p.id}`}
                        className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-primary-foreground font-bold rounded-lg glow-primary hover:opacity-90 transition-all"
                      >
                        Shop Now <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-foreground/10 border border-foreground/20 text-foreground font-semibold rounded-lg hover:border-primary hover:bg-primary/10 transition-all"
                      >
                        View All
                      </Link>
                    </div>
                  </div>

                  {/* Floating product image */}
                  <div className="hidden md:flex items-center justify-center p-12 relative">
                    <div
                      className={`relative transition-all duration-[1800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        active ? "opacity-100 translate-x-0 rotate-0" : "opacity-0 translate-x-12 rotate-3"
                      }`}
                    >
                      <div className="absolute -inset-8 bg-primary/30 rounded-full blur-3xl animate-pulse" />
                      <img
                        src={p.image}
                        alt={p.name}
                        className="relative w-full max-w-sm h-auto object-contain rounded-2xl shadow-2xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Arrows */}
        {products.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-background/70 backdrop-blur border border-primary/20 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-background/70 backdrop-blur border border-primary/20 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center justify-center"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}

        {/* Dots + progress */}
        {products.length > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-700 ${
                  i === index ? "w-10 bg-primary" : "w-2 bg-foreground/30 hover:bg-foreground/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCarousel;
