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
        // Locally-added products don't exist on the real API.
        const local = overlayStore.getAdded(Number(id));
        let data = local;
        if (!data) {
          const fetched = await getProductById(id);
          data = overlayStore.applyToOne(fetched); // merge edits, or null if deleted
        }

        if (!data) {
          setNotFoundFlag(true);
        } else {
          setProduct(data);
        }
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
      <Link href="/products" className="text-sm text-gray-500 hover:underline">
        ← Back to products
      </Link>

      <div className="grid gap-6 md:grid-cols-2">
        <ImageGallery images={product.images} title={product.title} />

        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          <p className="capitalize text-gray-500">{product.category}</p>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold">${product.price}</span>
            <Rating value={product.rating} />
          </div>
          <p className="text-sm text-gray-500">Stock: {product.stock}</p>
          <p className="text-gray-700">{product.description}</p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Reviews</h2>
        <ReviewList reviews={product.reviews} />
      </div>
    </div>
  );
}