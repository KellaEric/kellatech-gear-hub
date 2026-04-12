import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts, categories } from "@/data/products";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: products = [], isLoading } = useProducts();

  const filtered = products.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    if (cat === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mt-16 gradient-primary py-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-black text-primary-foreground mb-2">Shop All Products</h1>
        <p className="text-primary-foreground/80">Browse our complete catalog — prices in Ghana Cedis (GH₵)</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input type="text" placeholder="Search products..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card border border-primary/20 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button key={cat} onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? "gradient-primary text-primary-foreground glow-primary"
                  : "bg-card border border-primary/20 text-muted-foreground hover:text-foreground hover:border-primary"
              }`}>
              {cat}
            </button>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          {isLoading ? "Loading..." : `Showing ${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : !isLoading ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No products found</p>
            <p className="text-sm text-muted-foreground mt-2">Try a different search or category</p>
          </div>
        ) : null}
      </div>
      <Footer />
    </div>
  );
};

export default Shop;
