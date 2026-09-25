import { api } from "@/lib/axios";

// Plain list, with pagination.
export async function getProducts({ limit, skip, signal }) {
  const { data } = await api.get("/products", {
    params: { limit, skip },
    signal,
  });
  return data; // { products, total, skip, limit }
}

// Search by text.
export async function searchProducts({ q, limit, skip, signal }) {
  const { data } = await api.get("/products/search", {
    params: { q, limit, skip },
    signal,
  });
  return data;
}

// Filter by category.
export async function getProductsByCategory({ category, limit, skip, signal }) {
  const { data } = await api.get(`/products/category/${category}`, {
    params: { limit, skip },
    signal,
  });
  return data;
}

export async function getCategories() {
  const { data } = await api.get("/products/categories");
  return data; // array of { slug, name, url }
}

export async function getProductById(id) {
  const { data } = await api.get(`/products/${id}`);
  return data;
}