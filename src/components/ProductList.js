import Link from "next/link";
import Rating from "./Rating";

export default function ProductList({ products, onDelete }) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-[#E7E1D3] bg-white md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#E7E1D3] bg-[#FAF8F3] text-xs uppercase tracking-wide text-[#8B8171]">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-[#F1ECE1] last:border-0 hover:bg-[#FAF8F3]">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                 <img
                    src={p.thumbnail || "https://cdn.dummyjson.com/product-images/placeholder.jpg"}
                    alt={p.title}
                    className="h-12 w-12 rounded-lg border border-[#E7E1D3] object-cover"
                    />
                    <Link href={`/products/${p.id}`} className="font-medium text-[#211D17] hover:text-[#9C6B30]">
                      {p.title}
                    </Link>
                  </div>
                </td>
                <td className="p-4">
                  <span className="rounded-full bg-[#F3E7D3] px-2.5 py-1 text-xs capitalize text-[#7A5324]">
                    {p.category}
                  </span>
                </td>
                <td className="p-4 font-medium">${p.price}</td>
                <td className="p-4"><Rating value={p.rating} /></td>
                <td className="p-4 text-[#8B8171]">{p.stock}</td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <Link href={`/products/${p.id}/edit`} className="text-sm text-[#9C6B30] hover:underline">
                      Edit
                    </Link>
                    <button onClick={() => onDelete(p.id)} className="text-sm text-red-600 hover:underline">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {products.map((p) => (
          <div key={p.id} className="rounded-xl border border-[#E7E1D3] bg-white p-4">
            <Link href={`/products/${p.id}`} className="flex gap-3">
           <img
                src={p.thumbnail || "https://cdn.dummyjson.com/product-images/placeholder.jpg"}
                alt={p.title}
                className="h-12 w-12 rounded-lg border border-[#E7E1D3] object-cover"
                />
              <div className="flex flex-1 flex-col gap-1">
                <span className="font-medium text-[#211D17]">{p.title}</span>
                <span className="w-fit rounded-full bg-[#F3E7D3] px-2 py-0.5 text-xs capitalize text-[#7A5324]">
                  {p.category}
                </span>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-semibold">${p.price}</span>
                  <Rating value={p.rating} />
                </div>
                <span className="text-xs text-[#8B8171]">Stock: {p.stock}</span>
              </div>
            </Link>

            <div className="mt-3 flex gap-4 border-t border-[#F1ECE1] pt-3">
              <Link href={`/products/${p.id}/edit`} className="text-sm text-[#9C6B30] hover:underline">
                Edit
              </Link>
              <button onClick={() => onDelete(p.id)} className="text-sm text-red-600 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}