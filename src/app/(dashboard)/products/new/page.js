"use client";

import { useRouter } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import { createProduct } from "@/services/product.service";
import { overlayStore } from "@/lib/overlay";

export default function NewProductPage() {
  const router = useRouter();

  async function handleCreate(values) {
    const data = await createProduct(values);
    const thumbnail = values.thumbnail || "https://cdn.dummyjson.com/product-images/placeholder.jpg";
    const localProduct = {
      ...data,
      id: Date.now(),
      rating: 0,
      thumbnail,
      images: [thumbnail],
    };
    overlayStore.addProduct(localProduct);
    router.push("/products");
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#9C6B30]">Catalog</p>
        <h1 className="font-display text-2xl text-[#211D17]">Add Product</h1>
      </div>
      <ProductForm onSubmit={handleCreate} submitLabel="Create" />
    </div>
  );
}