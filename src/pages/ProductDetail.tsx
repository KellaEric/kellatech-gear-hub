import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/data/products";
import { useCart } from "@/context/CartContext";

const formatPrice = (price: number) =>
  `GH₵ ${price.toLocaleString("en-GH", { minimumFractionDigits: 2 })}`;

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { data: products = [], isLoading } = useProducts();
  const product = products.find((p) => p.id === id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mt-16 flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mt-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
            <Link to="/shop" className="text-primary font-semibold">← Back to Shop</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mt-16 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-semibold mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-primary/10">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {product.badge && (
              <span className="absolute top-4 left-4 gradient-primary text-primary-foreground text-sm font-bold px-4 py-1.5 rounded-full">
                {product.badge}
              </span>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm text-primary font-semibold uppercase tracking-wider mb-2">{product.category}</p>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-4">{product.name}</h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-black text-gradient">{formatPrice(product.price)}</span>
              {product.original_price && (
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.original_price)}</span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>

            <div className="bg-card border border-primary/10 rounded-xl p-5 mb-6">
              <h3 className="font-bold text-foreground mb-3">Specifications</h3>
              <ul className="space-y-2">
                {product.specs.map((spec, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" /> {spec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className={`text-sm font-semibold ${product.in_stock ? "text-success" : "text-destructive"}`}>
                {product.in_stock ? "✓ In Stock" : "✗ Out of Stock"}
              </span>
            </div>

            <button onClick={() => addToCart(product)} disabled={!product.in_stock}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 gradient-primary text-primary-foreground font-bold text-lg rounded-xl glow-primary hover:opacity-90 transition-all disabled:opacity-50">
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-black text-foreground mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
