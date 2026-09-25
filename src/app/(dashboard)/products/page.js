"use client";

import { Suspense, useEffect, useState } from "react";
import { useListParams } from "@/hooks/useListParams";
import { getProducts } from "@/services/product.service";
import { clampPage } from "@/lib/params";
import ProductList from "@/components/ProductList";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";

function ProductsPageInner() {
  const { params, update } = useListParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const skip = (params.page - 1) * params.limit;
        const data = await getProducts({ limit: params.limit, skip });
        if (ignore) return;

        setProducts(data.products);
        setTotal(data.total);

        // If the URL asked for a page beyond the real total, snap it back.
        const safePage = clampPage(params.page, data.total, params.limit);
        if (safePage !== params.page) {
          update({ page: safePage });
        }
      } catch (err) {
        if (!ignore) setError(err.message || "Failed to load products.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true; // avoid setting state after this effect is superseded
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.limit]);

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={() => update({ page: params.page })} />;
  if (products.length === 0) return <EmptyState />;

  return (
    <div className="space-y-4">
      <ProductList products={products} />
      <p className="text-sm text-gray-500">
        Showing {(params.page - 1) * params.limit + 1}–
        {Math.min(params.page * params.limit, total)} of {total}
      </p>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ProductsPageInner />
    </Suspense>
  );
}