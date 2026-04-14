import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Smartphone, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const formatPrice = (price: number) =>
  `GH₵ ${price.toLocaleString("en-GH", { minimumFractionDigits: 2 })}`;

type PaymentMethod = "mobile_money" | "card";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mobile_money");

  const [form, setForm] = useState({
    name: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    region: "",
    momoNumber: "",
    momoProvider: "mtn",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mt-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">No items to checkout</h1>
            <Link to="/shop" className="text-primary font-semibold hover:underline">← Back to Shop</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mt-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Please log in to checkout</h1>
            <p className="text-muted-foreground mb-4">You need an account to place an order</p>
            <Link to="/login" className="inline-flex px-6 py-3 gradient-primary text-primary-foreground font-semibold rounded-lg">
              Log In
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.address || !form.city) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (paymentMethod === "mobile_money" && !form.momoNumber) {
      toast.error("Please enter your mobile money number");
      return;
    }
    if (paymentMethod === "card" && (!form.cardNumber || !form.cardExpiry || !form.cardCvc)) {
      toast.error("Please fill in all card details");
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map((i) => ({
        product_id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image,
      }));

      const paymentRef = paymentMethod === "mobile_money"
        ? `MOMO-${form.momoProvider.toUpperCase()}-${Date.now()}`
        : `CARD-${Date.now()}`;

      const { error } = await supabase.from("orders").insert({
        user_id: user.id,
        items: orderItems,
        total: totalPrice,
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone || null,
        shipping_address: form.address,
        shipping_city: form.city,
        shipping_region: form.region || null,
        payment_method: paymentMethod,
        payment_reference: paymentRef,
        status: "pending",
      } as any);

      if (error) throw error;

      clearCart();
      toast.success("Order placed successfully!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mt-16 max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-semibold mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className="text-3xl font-black text-foreground mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact */}
            <div className="bg-card border border-primary/10 rounded-xl p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Full Name *</label>
                  <input value={form.name} onChange={(e) => update("name", e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    placeholder="John Doe" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    placeholder="you@email.com" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-foreground mb-1">Phone</label>
                  <input value={form.phone} onChange={(e) => update("phone", e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    placeholder="024 xxx xxxx" />
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-card border border-primary/10 rounded-xl p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-foreground mb-1">Address *</label>
                  <input value={form.address} onChange={(e) => update("address", e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    placeholder="Street address" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">City *</label>
                  <input value={form.city} onChange={(e) => update("city", e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    placeholder="Accra" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Region</label>
                  <input value={form.region} onChange={(e) => update("region", e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    placeholder="Greater Accra" />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-card border border-primary/10 rounded-xl p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Payment Method</h2>
              <div className="flex gap-3 mb-4">
                <button type="button" onClick={() => setPaymentMethod("mobile_money")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border text-sm font-semibold transition-all ${
                    paymentMethod === "mobile_money"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-primary/20 text-muted-foreground hover:border-primary/40"
                  }`}>
                  <Smartphone className="w-4 h-4" /> Mobile Money
                </button>
                <button type="button" onClick={() => setPaymentMethod("card")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border text-sm font-semibold transition-all ${
                    paymentMethod === "card"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-primary/20 text-muted-foreground hover:border-primary/40"
                  }`}>
                  <CreditCard className="w-4 h-4" /> Card
                </button>
              </div>

              {paymentMethod === "mobile_money" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1">Provider</label>
                    <select value={form.momoProvider} onChange={(e) => update("momoProvider", e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary">
                      <option value="mtn">MTN Mobile Money</option>
                      <option value="vodafone">Vodafone Cash</option>
                      <option value="airteltigo">AirtelTigo Money</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1">Mobile Money Number *</label>
                    <input value={form.momoNumber} onChange={(e) => update("momoNumber", e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                      placeholder="024 xxx xxxx" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1">Card Number *</label>
                    <input value={form.cardNumber} onChange={(e) => update("cardNumber", e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                      placeholder="1234 5678 9012 3456" maxLength={19} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1">Expiry *</label>
                      <input value={form.cardExpiry} onChange={(e) => update("cardExpiry", e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                        placeholder="MM/YY" maxLength={5} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1">CVC *</label>
                      <input value={form.cardCvc} onChange={(e) => update("cardCvc", e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                        placeholder="123" maxLength={4} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Order summary */}
          <div>
            <div className="bg-card border border-primary/20 rounded-xl p-6 sticky top-24">
              <h2 className="text-lg font-bold text-foreground mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground line-clamp-1">{product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-foreground">{formatPrice(product.price * quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-primary/10 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-primary font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-lg font-black text-foreground pt-2 border-t border-primary/10">
                  <span>Total</span>
                  <span className="text-gradient">{formatPrice(totalPrice)}</span>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full mt-6 py-4 gradient-primary text-primary-foreground font-bold text-lg rounded-xl glow-primary hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : "Place Order"}
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
