import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  original_price?: number | null;
  description: string;
  specs: string[];
  image: string;
  badge?: string | null;
  in_stock: boolean;
}

export const categories = [
  "All",
  "Laptops",
  "Desktops",
  "Monitors",
  "Printers",
  "Computer Parts",
  "Accessories",
  "Networking",
] as const;

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: Number(p.price),
        original_price: p.original_price ? Number(p.original_price) : null,
        description: p.description,
        specs: p.specs ?? [],
        image: p.image,
        badge: p.badge,
        in_stock: p.in_stock,
      }));
    },
  });
};

// Keep backward-compat export for components that import `products` directly
export const products: Product[] = [];
