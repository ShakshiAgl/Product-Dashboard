import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="font-display text-2xl text-[#211D17]">Product not found</h1>
      <p className="text-[#8B8171]">We couldn't find a product with that ID.</p>
      <Link href="/products" className="rounded-lg bg-[#1C1917] px-4 py-2 text-sm text-white hover:bg-[#2A2521]">
        Back to products
      </Link>
    </div>
  );
}