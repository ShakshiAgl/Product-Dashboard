import Link from "next/link";
import Rating from "./Rating";

export default function ProductList({ products }) {
  return (
    <>
      {/* Table: hidden below md, shown at md and up */}
      <table className="hidden w-full border-collapse text-left text-sm md:table">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="p-3">Image</th>
            <th className="p-3">Title</th>
            <th className="p-3">Category</th>
            <th className="p-3">Price</th>
            <th className="p-3">Rating</th>
            <th className="p-3">Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="p-3">
                <img src={p.thumbnail} alt={p.title} className="h-12 w-12 rounded object-cover" />
              </td>
              <td className="p-3">
                <Link href={`/products/${p.id}`} className="font-medium hover:underline">
                  {p.title}
                </Link>
              </td>
              <td className="p-3 capitalize text-gray-600">{p.category}</td>
              <td className="p-3">${p.price}</td>
              <td className="p-3">
                <Rating value={p.rating} />
              </td>
              <td className="p-3">{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Cards: shown below md, hidden at md and up */}
      <div className="grid gap-3 md:hidden">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="flex gap-3 rounded-lg border bg-white p-3 shadow-sm"
          >
            <img src={p.thumbnail} alt={p.title} className="h-16 w-16 rounded object-cover" />
            <div className="flex flex-1 flex-col gap-1">
              <span className="font-medium">{p.title}</span>
              <span className="text-sm capitalize text-gray-500">{p.category}</span>
              <div className="flex items-center justify-between">
                <span className="font-semibold">${p.price}</span>
                <Rating value={p.rating} />
              </div>
              <span className="text-xs text-gray-500">Stock: {p.stock}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}