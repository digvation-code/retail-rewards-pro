import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CatalogItem {
  id: string;
  name: string;
  description: string | null;
  points_cost: number;
  category: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export function useCatalog() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('catalog_items')
        .select('*')
        .eq('is_active', true)
        .order('points_cost', { ascending: true });

      if (!error && data) {
        setItems(data);
      }
      setLoading(false);
    };

    fetchItems();
  }, []);

  return { items, loading };
}
