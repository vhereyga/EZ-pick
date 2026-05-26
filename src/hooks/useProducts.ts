import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';

export function useProducts(category?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let query = supabase
      .from('products')
      .select('*')
      .order('review_count', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    query.then(({ data, error: err }) => {
      if (err) setError(err.message);
      else setProducts(data as Product[]);
      setLoading(false);
    });
  }, [category]);

  return { products, loading, error };
}
