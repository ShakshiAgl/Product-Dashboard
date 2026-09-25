"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import { getProductById, updateProduct } from "@/services/product.service";
import { overlayStore } from "@/lib/overlay";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const local = overlayStore.getAdded(Number(id));
        const data = local || overlayStore.applyToOne(await getProductById(id));
        if (!data) throw new Error("Product not found.");
        setProduct(data);
      } catch (err) {
        setError(err.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleUpdate(values) {
    if (!overlayStore.getAdded(Number(id))) {
      await updateProduct(id, values);
    }
    overlayStore.editProduct(Number(id), values);
    router.push(`/products/${id}`);
  }

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={() => router.refresh()} />;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#9C6B30]">Catalog</p>
        <h1 className="font-display text-2xl text-[#211D17]">Edit Product</h1>
      </div>
      <ProductForm initialValues={product} onSubmit={handleUpdate} submitLabel="Save changes" />
    </div>
  );
}