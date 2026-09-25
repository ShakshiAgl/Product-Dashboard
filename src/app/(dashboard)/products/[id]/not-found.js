import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <h1 className="text-2xl font-semibold">Product not found</h1>
      <p className="text-gray-500">We couldn't find a product with that ID.</p>
      <Link href="/products" className="rounded bg-black px-4 py-2 text-sm text-white">
        Back to products
      </Link>
    </div>
  );
}