import { notFound } from "next/navigation";
import { getProductById } from "@/services/product.service";
import ImageGallery from "@/components/ImageGallery";
import Rating from "@/components/Rating";
import ReviewList from "@/components/ReviewList";
import Link from "next/link";

export default async function ProductDetailsPage({ params }) {
  const { id } = await params; // Next 15+/16 passes params as a Promise

  // Reject obviously invalid ids before even calling the API.
  if (!/^\d+$/.test(id)) {
    notFound();
  }

  let product;
  try {
    product = await getProductById(id);
  } catch {
    notFound(); // covers a valid-looking id (e.g. "9999") that the API doesn't have
  }

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