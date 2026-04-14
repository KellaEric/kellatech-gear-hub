import { Link } from "react-router-dom";
import { Package, ArrowRight, Clock, CheckCircle, Truck, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const formatPrice = (price: number) =>
  `GH₵ ${price.toLocaleString("en-GH", { minimumFractionDigits: 2 })}`;

const statusConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  pending: { label: "Pending", icon: <Clock className="w-4 h-4" />, color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/30" },
  processing: { label: "Processing", icon: <Package className="w-4 h-4" />, color: "text-blue-500 bg-blue-500/10 border-blue-500/30" },
  shipped: { label: "Shipped", icon: <Truck className="w-4 h-4" />, color: "text-primary bg-primary/10 border-primary/30" },
  delivered: { label: "Delivered", icon: <CheckCircle className="w-4 h-4" />, color: "text-green-500 bg-green-500/10 border-green-500/30" },
  cancelled: { label: "Cancelled", icon: <XCircle className="w-4 h-4" />, color: "text-destructive bg-destructive/10 border-destructive/30" },
};

const Orders = () => {
  const { user } = useAuth();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mt-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Please log in</h1>
            <p className="text-muted-foreground mb-4">You need an account to view your orders</p>
            <Link to="/login" className="inline-flex px-6 py-3 gradient-primary text-primary-foreground font-semibold rounded-lg">
              Log In
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
      <div className="mt-16 gradient-primary py-10 text-center">
        <h1 className="text-3xl font-black text-primary-foreground">My Orders</h1>
        <p className="text-primary-foreground/80 mt-1">Track and review your past purchases</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {isLoading ? (
          <p className="text-center text-muted-foreground py-20">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
            <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-primary-foreground font-semibold rounded-lg">
              Browse Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const items = (order.items as any[]) || [];
              const status = statusConfig[order.status] || statusConfig.pending;
              return (
                <div key={order.id} className="bg-card border border-primary/10 rounded-xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Order placed {new Date(order.created_at).toLocaleDateString("en-GH", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${status.color}`}>
                      {status.icon} {status.label}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground line-clamp-1">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                        </div>
                        <p className="text-sm font-bold text-foreground">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-primary/10 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {order.payment_method === "mobile_money" ? "Mobile Money" : "Card"} • {order.shipping_city}
                    </span>
                    <span className="text-lg font-black text-gradient">{formatPrice(Number(order.total))}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
