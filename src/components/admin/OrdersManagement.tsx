import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
const STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_region: string | null;
  payment_method: string;
  payment_reference: string | null;
  status: string;
  created_at: string;
}

const statusColor = (s: string) => {
  switch (s) {
    case "pending": return "bg-yellow-500/20 text-yellow-400";
    case "processing": return "bg-blue-500/20 text-blue-400";
    case "shipped": return "bg-purple-500/20 text-purple-400";
    case "delivered": return "bg-green-500/20 text-green-400";
    case "cancelled": return "bg-red-500/20 text-red-400";
    default: return "bg-muted text-muted-foreground";
  }
};

const OrdersManagement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Order[];
    },
  });

  const updateStatus = async (id: string, status: OrderStatus) => {
    setUpdating(id);
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Order marked as ${status}` });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    }
    setUpdating(null);
  };

  const filtered = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    revenue: orders.filter((o) => o.status === "delivered").reduce((s, o) => s + Number(o.total), 0),
  };

  if (isLoading) {
    return <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" /></div>;
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Orders", value: stats.total },
          { label: "Pending", value: stats.pending },
          { label: "Processing", value: stats.processing },
          { label: "Revenue (Delivered)", value: `GH₵${stats.revenue.toLocaleString()}` },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-primary/20 rounded-xl p-4 text-center">
            <p className="text-xl font-black text-primary">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-muted border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary"
        >
          <option value="all">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {/* Orders */}
      <div className="bg-card border border-primary/20 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <p className="px-4 py-12 text-center text-muted-foreground">No orders found</p>
        ) : (
          <div className="divide-y divide-primary/10">
            {filtered.map((o) => {
              const isOpen = expanded === o.id;
              return (
                <div key={o.id} className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <button
                      onClick={() => setExpanded(isOpen ? null : o.id)}
                      className="flex items-center gap-2 text-left flex-1 min-w-0"
                    >
                      {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">{o.customer_name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          #{o.id.slice(0, 8)} · {new Date(o.created_at).toLocaleDateString()} · {o.customer_email}
                        </p>
                      </div>
                    </button>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-bold text-foreground">GH₵{Number(o.total).toLocaleString()}</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor(o.status)}`}>
                        {o.status}
                      </span>
                      <select
                        value={o.status}
                        disabled={updating === o.id}
                        onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
                        className="px-3 py-1.5 bg-muted border border-primary/20 rounded-lg text-foreground text-xs focus:outline-none focus:border-primary disabled:opacity-50"
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-4 pl-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-semibold text-foreground mb-2">Shipping</p>
                        <p className="text-muted-foreground">{o.shipping_address}</p>
                        <p className="text-muted-foreground">{o.shipping_city}{o.shipping_region ? `, ${o.shipping_region}` : ""}</p>
                        {o.customer_phone && <p className="text-muted-foreground">📞 {o.customer_phone}</p>}
                        <p className="text-muted-foreground mt-2">
                          <span className="font-semibold text-foreground">Payment:</span> {o.payment_method}
                          {o.payment_reference && ` (${o.payment_reference})`}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground mb-2">Items ({o.items.length})</p>
                        <ul className="space-y-2">
                          {o.items.map((it, i) => (
                            <li key={i} className="flex items-center gap-2">
                              {it.image && <img src={it.image} alt={it.name} className="w-10 h-10 rounded object-cover border border-primary/20" />}
                              <div className="flex-1 min-w-0">
                                <p className="text-foreground truncate">{it.name}</p>
                                <p className="text-xs text-muted-foreground">{it.quantity} × GH₵{Number(it.price).toLocaleString()}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersManagement;
