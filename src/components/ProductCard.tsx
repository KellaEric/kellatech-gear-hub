import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

const formatPrice = (price: number) =>
  `GH₵ ${price.toLocaleString("en-GH", { minimumFractionDigits: 2 })}`;

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group bg-card rounded-xl border border-primary/10 overflow-hidden card-hover">
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/3] overflow-hidden">
        <img src={product.image} alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        {product.badge && (
          <span className="absolute top-3 left-3 gradient-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
            {product.badge}
          </span>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <span className="text-destructive font-bold">Out of Stock</span>
          </div>
        )}
      </Link>

      <div className="p-4">
        <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-foreground text-sm leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-black text-gradient">{formatPrice(product.price)}</span>
          {product.original_price && (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.original_price)}</span>
          )}
        </div>

        <button onClick={() => addToCart(product)} disabled={!product.in_stock}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg gradient-primary text-primary-foreground text-sm font-semibold glow-primary hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          <ShoppingCart className="w-4 h-4" /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
