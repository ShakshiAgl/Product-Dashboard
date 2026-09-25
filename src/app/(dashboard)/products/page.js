"use client";

import { Suspense, useEffect, useState } from "react";
import { useListParams } from "@/hooks/useListParams";
import { useCategories } from "@/hooks/useCategories";
import { getProducts, getProductsByCategory } from "@/services/product.service";
import { clampPage } from "@/lib/params";
import ProductList from "@/components/ProductList";
import ProductFilters from "@/components/ProductFilters";
import Pagination from "@/components/Pagination";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";

function sortProducts(products, sortBy, order) {
  if (!sortBy) return products;
  const sorted = [...products].sort((a, b) => {
    const av = a[sortBy];
    const bv = b[sortBy];
    if (typeof av === "string") return av.localeCompare(bv);
    return av - bv;
  });
  return order === "desc" ? sorted.reverse() : sorted;
}

function ProductsPageInner() {
  const { params, update } = useListParams();
  const categories = useCategories();
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
        let data;

        if (params.category) {
          // Category endpoint doesn't accept sortBy/order query params reliably,
          // so we sort the returned page on the client instead.
          data = await getProductsByCategory({
            category: params.category,
            limit: params.limit,
            skip,
          });
        } else {
          data = await getProducts({
            limit: params.limit,
            skip,
            sortBy: params.sortBy || undefined,
            order: params.sortBy ? params.order : undefined,
          });
        }

        if (ignore) return;

        const sorted = params.category
          ? sortProducts(data.products, params.sortBy, params.order)
          : data.products;

        setProducts(sorted);
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
  }, [params.page, params.limit, params.category, params.sortBy, params.order]);

  function handlePageChange(nextPage) {
    update({ page: nextPage });
  }

  function handleLimitChange(nextLimit) {
    update({ limit: nextLimit, page: 1 });
  }

  function handleCategoryChange(nextCategory) {
    // Picking a category clears any active search (mutually exclusive),
    // and always resets to page 1 since the result set changes.
    update({ category: nextCategory, q: "", page: 1 });
  }

  function handleSortChange({ sortBy, order }) {
    update({ sortBy, order, page: 1 });
  }

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={() => update({ page: params.page })} />;

  return (
    <div className="space-y-4">
      <ProductFilters
        category={params.category}
        categories={categories}
        sortBy={params.sortBy}
        order={params.order}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
      />

      {products.length === 0 ? <EmptyState /> : <ProductList products={products} />}

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