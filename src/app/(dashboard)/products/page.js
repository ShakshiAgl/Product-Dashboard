"use client";

import { Suspense, useEffect, useState } from "react";
import { useListParams } from "@/hooks/useListParams";
import { getProducts } from "@/services/product.service";
import { clampPage } from "@/lib/params";
import ProductList from "@/components/ProductList";
import Pagination from "@/components/Pagination";
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
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.limit]);

  function handlePageChange(nextPage) {
    update({ page: nextPage });
  }

  function handleLimitChange(nextLimit) {
    update({ limit: nextLimit, page: 1 }); // reset to page 1 on size change
  }

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={() => update({ page: params.page })} />;

  return (
    <div className="space-y-4">
      {products.length === 0 ? (
        <EmptyState />
      ) : (
        <ProductList products={products} />
      )}

      <Pagination
        page={params.page}
        limit={params.limit}
        total={total}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
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