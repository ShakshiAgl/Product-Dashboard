"use client";

import { useRouter } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import { createProduct } from "@/services/product.service";
import { overlayStore } from "@/lib/overlay";

export default function NewProductPage() {
  const router = useRouter();

  async function handleCreate(values) {
    const data = await createProduct(values); // real API call, response is not actually saved server-side
    // DummyJSON echoes an id, but that id is not guaranteed unique/stable,
    // so we generate our own to avoid clashing with real product ids.
    const localProduct = { ...data, id: Date.now(), rating: 0, images: [values.thumbnail].filter(Boolean) };
    overlayStore.addProduct(localProduct);
    router.push("/products");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Add Product</h1>
      <ProductForm onSubmit={handleCreate} submitLabel="Create" />
    </div>
  );
}