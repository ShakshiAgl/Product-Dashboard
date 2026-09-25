"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useListParams } from "@/hooks/useListParams";
import { useCategories } from "@/hooks/useCategories";
import { getProducts, getProductsByCategory, searchProducts } from "@/services/product.service";
import { clampPage } from "@/lib/params";
import { isCancel } from "@/lib/axios";
import ProductList from "@/components/ProductList";
import ProductFilters from "@/components/ProductFilters";
import SearchBox from "@/components/SearchBox";
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
  const abortRef = useRef(null); // holds the controller for the in-flight request

  useEffect(() => {
    // Cancel whatever request is still running before starting a new one.
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const skip = (params.page - 1) * params.limit;
        let data;

        if (params.q) {
          // Search mode: category is ignored here by design (see Step 6 note) —
          // the URL update functions below make sure both are never set at once anyway.
          data = await searchProducts({
            q: params.q,
            limit: params.limit,
            skip,
            signal: controller.signal,
          });
        } else if (params.category) {
          data = await getProductsByCategory({
            category: params.category,
            limit: params.limit,
            skip,
            signal: controller.signal,
          });
        } else {
          data = await getProducts({
            limit: params.limit,
            skip,
            sortBy: params.sortBy || undefined,
            order: params.sortBy ? params.order : undefined,
            signal: controller.signal,
          });
        }

        const sorted = params.q || params.category
          ? sortProducts(data.products, params.sortBy, params.order)
          : data.products;

        setProducts(sorted);
        setTotal(data.total);

        const safePage = clampPage(params.page, data.total, params.limit);
        if (safePage !== params.page) {
          update({ page: safePage });
        }
      } catch (err) {
        if (isCancel(err)) return; // this request was superseded — do nothing
        setError(err.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    }

    load();

    return () => {
      controller.abort(); // cancel if params change again before this finishes, or on unmount
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.limit, params.category, params.sortBy, params.order, params.q]);

  function handlePageChange(nextPage) {
    update({ page: nextPage });
  }

  function handleLimitChange(nextLimit) {
    update({ limit: nextLimit, page: 1 });
  }

  function handleCategoryChange(nextCategory) {
    update({ category: nextCategory, q: "", page: 1 }); // category wins, clears search
  }

  function handleSortChange({ sortBy, order }) {
    update({ sortBy, order, page: 1 });
  }

  function handleSearchChange(nextQ) {
    update({ q: nextQ, category: "", page: 1 }); // search wins, clears category
  }

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={() => update({ page: params.page })} />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchBox initialValue={params.q} onDebouncedChange={handleSearchChange} />
        <ProductFilters
          category={params.category}
          categories={categories}
          sortBy={params.sortBy}
          order={params.order}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
        />
      </div>

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