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
        // A locally-added product doesn't exist on the real API, so check the overlay first.
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
      // Only call the real API for products that actually exist there;
      // a locally-added product has nothing to PUT to.
      await updateProduct(id, values);
    }
    overlayStore.editProduct(Number(id), values);
    router.push(`/products/${id}`);
  }

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={() => router.refresh()} />;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit Product</h1>
      <ProductForm initialValues={product} onSubmit={handleUpdate} submitLabel="Save changes" />
    </div>
  );
}