import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Package, Search, X, Save, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProducts, categories, type Product } from "@/data/products";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categoryOptions = categories.filter((c) => c !== "All");

const emptyProduct = {
  name: "",
  category: categoryOptions[0],
  price: 0,
  original_price: null as number | null,
  description: "",
  specs: [] as string[],
  image: "",
  badge: "" as string | null,
  in_stock: true,
};

type FormData = typeof emptyProduct;

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: roleLoading } = useAdmin();
  const { data: products = [], isLoading } = useProducts();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormData>({ ...emptyProduct });
  const [specsInput, setSpecsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center mt-20">
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground mt-2">Please log in to access the admin panel.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center mt-20">
          <h1 className="text-2xl font-bold text-foreground">Admin Only</h1>
          <p className="text-muted-foreground mt-2">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const filtered = products.filter((p) => {
    const matchesCat = catFilter === "All" || p.category === catFilter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyProduct });
    setSpecsInput("");
    setCreating(true);
  };

  const openEdit = (p: Product) => {
    setCreating(false);
    setEditing(p.id);
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      original_price: p.original_price ?? null,
      description: p.description,
      specs: p.specs,
      image: p.image,
      badge: p.badge ?? "",
      in_stock: p.in_stock,
    });
    setSpecsInput(p.specs.join("\n"));
  };

  const closeForm = () => {
    setCreating(false);
    setEditing(null);
  };

  const handleSave = async () => {
    if (!form.name || !form.description || !form.image || form.price <= 0) {
      toast({ title: "Fill all required fields", variant: "destructive" });
      return;
    }
    setSaving(true);
    const specs = specsInput.split("\n").map((s) => s.trim()).filter(Boolean);
    const payload = {
      name: form.name,
      category: form.category,
      price: form.price,
      original_price: form.original_price || null,
      description: form.description,
      specs,
      image: form.image,
      badge: form.badge || null,
      in_stock: form.in_stock,
    };

    if (editing) {
      const { error } = await supabase.from("products").update(payload).eq("id", editing);
      if (error) {
        toast({ title: "Update failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Product updated!" });
        closeForm();
      }
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) {
        toast({ title: "Create failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Product created!" });
        closeForm();
      }
    }
    setSaving(false);
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setDeleting(id);
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Product deleted" });
    }
    setDeleting(null);
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const showForm = creating || editing;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-foreground flex items-center gap-2">
              <Package className="w-8 h-8 text-primary" /> Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your product catalog</p>
          </div>
          <button onClick={openCreate}
            className="px-5 py-2.5 gradient-primary text-primary-foreground font-bold rounded-lg glow-primary hover:opacity-90 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-card border border-primary/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">{editing ? "Edit Product" : "New Product"}</h2>
                <button onClick={closeForm} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-foreground mb-1">Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Category *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary">
                    {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Badge</label>
                  <input value={form.badge ?? ""} onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    placeholder="e.g. New, Sale, Hot"
                    className="w-full px-4 py-2.5 bg-muted border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Price (GH₵) *</label>
                  <input type="number" min="0" step="0.01" value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-muted border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Original Price (GH₵)</label>
                  <input type="number" min="0" step="0.01" value={form.original_price ?? ""}
                    onChange={(e) => setForm({ ...form, original_price: e.target.value ? parseFloat(e.target.value) : null })}
                    placeholder="For showing discount"
                    className="w-full px-4 py-2.5 bg-muted border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-foreground mb-1">Image URL *</label>
                  <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-muted border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary" />
                  {form.image && (
                    <img src={form.image} alt="Preview" className="w-20 h-20 object-cover rounded-lg mt-2 border border-primary/20" />
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-foreground mb-1">Description *</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-muted border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary resize-none" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-foreground mb-1">Specs (one per line)</label>
                  <textarea value={specsInput} onChange={(e) => setSpecsInput(e.target.value)}
                    rows={4} placeholder={"Intel Core i7\n16GB RAM\n512GB SSD"}
                    className="w-full px-4 py-2.5 bg-muted border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary resize-none font-mono text-sm" />
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="in_stock" checked={form.in_stock}
                    onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
                    className="w-4 h-4 accent-primary" />
                  <label htmlFor="in_stock" className="text-sm font-semibold text-foreground">In Stock</label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={closeForm}
                  className="px-5 py-2.5 border border-primary/20 rounded-lg text-foreground font-semibold hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="px-5 py-2.5 gradient-primary text-primary-foreground font-bold rounded-lg glow-primary hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editing ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 bg-muted border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary" />
          </div>
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
            className="px-4 py-2.5 bg-muted border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Products", value: products.length },
            { label: "In Stock", value: products.filter((p) => p.in_stock).length },
            { label: "Out of Stock", value: products.filter((p) => !p.in_stock).length },
            { label: "Categories", value: new Set(products.map((p) => p.category)).size },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-primary/20 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Product Table */}
        {isLoading ? (
          <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" /></div>
        ) : (
          <div className="bg-card border border-primary/20 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-primary/20 text-left">
                    <th className="px-4 py-3 text-muted-foreground font-semibold">Image</th>
                    <th className="px-4 py-3 text-muted-foreground font-semibold">Name</th>
                    <th className="px-4 py-3 text-muted-foreground font-semibold hidden sm:table-cell">Category</th>
                    <th className="px-4 py-3 text-muted-foreground font-semibold">Price</th>
                    <th className="px-4 py-3 text-muted-foreground font-semibold hidden md:table-cell">Stock</th>
                    <th className="px-4 py-3 text-muted-foreground font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b border-primary/10 hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">
                        <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg border border-primary/20" />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-foreground">{p.name}</p>
                        {p.badge && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{p.badge}</span>}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{p.category}</td>
                      <td className="px-4 py-3 font-bold text-foreground">GH₵{p.price.toLocaleString()}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.in_stock ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                          {p.in_stock ? "In Stock" : "Out"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(p)}
                            className="p-2 rounded-lg hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                            className="p-2 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors disabled:opacity-50">
                            {deleting === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No products found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
