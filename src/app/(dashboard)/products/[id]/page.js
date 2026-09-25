"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { getProductById } from "@/services/product.service";
import { overlayStore } from "@/lib/overlay";
import ImageGallery from "@/components/ImageGallery";
import Rating from "@/components/Rating";
import ReviewList from "@/components/ReviewList";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      setNotFoundFlag(false);

      if (!/^\d+$/.test(id)) {
        setNotFoundFlag(true);
        setLoading(false);
        return;
      }

      try {
        const local = overlayStore.getAdded(Number(id));
        let data = local;
        if (!data) {
          const fetched = await getProductById(id);
          data = overlayStore.applyToOne(fetched);
        }
        if (!data) setNotFoundFlag(true);
        else setProduct(data);
      } catch {
        setNotFoundFlag(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <Loader />;
  if (notFoundFlag) return notFound();
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!product) return null;

  return (
    <div className="space-y-6">
      <Link href="/products" className="text-sm text-[#8B8171] hover:text-[#9C6B30]">
        ← Back to products
      </Link>

      <div className="grid gap-6 md:grid-cols-2">
        <ImageGallery images={product.images} title={product.title} />

        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#9C6B30] capitalize">{product.category}</p>
            <h1 className="font-display text-3xl text-[#211D17]">{product.title}</h1>
          </div>

          <div className="rounded-xl border border-[#E7E1D3] bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-[#8B8171]">Price</p>
            <div className="mt-1 flex items-center gap-3">
              <span className="font-display text-2xl text-[#211D17]">${product.price}</span>
              <Rating value={product.rating} />
            </div>
          </div>

          <p className="text-[#5C5548]">{product.description}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#E7E1D3] bg-white p-3">
              <p className="text-xs uppercase tracking-wide text-[#8B8171]">Stock</p>
              <p className="mt-1 font-medium text-[#211D17]">{product.stock} units</p>
            </div>
            <div className="rounded-xl border border-[#E7E1D3] bg-white p-3">
              <p className="text-xs uppercase tracking-wide text-[#8B8171]">Brand</p>
              <p className="mt-1 font-medium text-[#211D17]">{product.brand || "—"}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-display mb-3 text-lg text-[#211D17]">Reviews</h2>
        <ReviewList reviews={product.reviews} />
      </div>
    </div>
  );
}