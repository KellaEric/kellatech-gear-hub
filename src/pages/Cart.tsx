import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

const formatPrice = (price: number) =>
  `GH₵ ${price.toLocaleString("en-GH", { minimumFractionDigits: 2 })}`;

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mt-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Start shopping to add items to your cart</p>
            <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-primary-foreground font-semibold rounded-lg">
              Browse Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mt-16 max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-foreground">Shopping Cart</h1>
          <button onClick={clearCart} className="text-sm text-destructive hover:underline font-semibold">
            Clear Cart
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="bg-card border border-primary/10 rounded-xl p-4 flex items-center gap-4">
              <img src={product.image} alt={product.name} className="w-20 h-20 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <Link to={`/product/${product.id}`} className="font-bold text-foreground text-sm hover:text-primary transition-colors line-clamp-1">
                  {product.name}
                </Link>
                <p className="text-xs text-muted-foreground">{product.category}</p>
                <p className="font-bold text-gradient text-sm mt-1">{formatPrice(product.price)}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="p-1.5 rounded-lg bg-muted text-foreground hover:bg-primary/20 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-bold text-foreground text-sm">{quantity}</span>
                <button
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  className="p-1.5 rounded-lg bg-muted text-foreground hover:bg-primary/20 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="font-bold text-foreground w-28 text-right">{formatPrice(product.price * quantity)}</p>

              <button
                onClick={() => removeFromCart(product.id)}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-card border border-primary/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg text-foreground font-semibold">Total</span>
            <span className="text-2xl font-black text-gradient">{formatPrice(totalPrice)}</span>
          </div>
          <button className="w-full py-4 gradient-primary text-primary-foreground font-bold text-lg rounded-xl glow-primary hover:opacity-90 transition-all">
            Proceed to Checkout
          </button>
          <Link to="/shop" className="block text-center text-sm text-primary font-semibold mt-4 hover:underline">
            ← Continue Shopping
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
