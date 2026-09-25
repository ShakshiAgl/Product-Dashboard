"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useListParams } from "@/hooks/useListParams";
import { useCategories } from "@/hooks/useCategories";
import {
  getProducts,
  getProductsByCategory,
  searchProducts,
  deleteProduct,
} from "@/services/product.service";
import { clampPage } from "@/lib/params";
import { isCancel } from "@/lib/axios";
import { overlayStore } from "@/lib/overlay";
import ProductList from "@/components/ProductList";
import ProductFilters from "@/components/ProductFilters";
import SearchBox from "@/components/SearchBox";
import Pagination from "@/components/Pagination";
import ConfirmDialog from "@/components/ConfirmDialog";
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
  const abortRef = useRef(null);

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
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

        const sorted =
          params.q || params.category
            ? sortProducts(data.products, params.sortBy, params.order)
            : data.products;

        // Apply locally-added/edited/deleted products on top of the real API response.
        const withOverlay = overlayStore.applyToList(sorted);

        setProducts(withOverlay);
        setTotal(data.total);

        const safePage = clampPage(params.page, data.total, params.limit);
        if (safePage !== params.page) {
          update({ page: safePage });
        }
      } catch (err) {
        if (isCancel(err)) return;
        setError(err.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    }

    load();

    return () => {
      controller.abort();
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
    update({ category: nextCategory, q: "", page: 1 });
  }

  function handleSortChange({ sortBy, order }) {
    update({ sortBy, order, page: 1 });
  }

  function handleSearchChange(nextQ) {
    update({ q: nextQ, category: "", page: 1 });
  }

  async function handleConfirmDelete() {
    setDeleting(true);
    try {
      const isLocalOnly = overlayStore.getAdded(confirmDeleteId);
      if (!isLocalOnly) {
        await deleteProduct(confirmDeleteId); // real API call; not actually persisted server-side
      }
      overlayStore.deleteProduct(confirmDeleteId);
      setProducts((prev) => prev.filter((p) => p.id !== confirmDeleteId));
      setTotal((t) => Math.max(0, t - 1));
    } catch (err) {
      setError(err.message || "Failed to delete product.");
    } finally {
      setDeleting(false);
      setConfirmDeleteId(null);
    }
  }

  if (loading) return <Loader />;
  if (error) {
    return (
      <ErrorState message={error} onRetry={() => update({ page: params.page })} />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <Link
          href="/products/new"
          className="rounded bg-black px-3 py-1.5 text-sm text-white"
        >
          + Add Product
        </Link>
      </div>

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

      {products.length === 0 ? (
        <EmptyState />
      ) : (
        <ProductList products={products} onDelete={(id) => setConfirmDeleteId(id)} />
      )}

      <Pagination
        page={params.page}
        limit={params.limit}
        total={total}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete product?"
        message="This will remove the product from your list. This cannot be undone."
        confirming={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
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