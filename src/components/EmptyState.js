export default function EmptyState({ message = "No products found." }) {
  return <p className="py-10 text-center text-gray-500">{message}</p>;
}