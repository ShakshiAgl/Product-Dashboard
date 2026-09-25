const ALLOWED_LIMITS = [10, 20, 50];
const ALLOWED_SORT_FIELDS = ["title", "price", "rating"];
const ALLOWED_ORDERS = ["asc", "desc"];

export function parseListParams(searchParams) {
  // searchParams is a URLSearchParams instance
  const rawPage = Number(searchParams.get("page"));
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const rawLimit = Number(searchParams.get("limit"));
  const limit = ALLOWED_LIMITS.includes(rawLimit) ? rawLimit : 10;

  const q = searchParams.get("q")?.trim() || "";

  const category = searchParams.get("category")?.trim() || "";

  const rawSortBy = searchParams.get("sortBy");
  const sortBy = ALLOWED_SORT_FIELDS.includes(rawSortBy) ? rawSortBy : "";

  const rawOrder = searchParams.get("order");
  const order = ALLOWED_ORDERS.includes(rawOrder) ? rawOrder : "asc";

  return { page, limit, q, category, sortBy, order };
}

// page=999 becomes valid once we know "total" from the API response,
// so this is called again after the fetch to clamp it into range.
export function clampPage(page, total, limit) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (page > totalPages) return totalPages;
  if (page < 1) return 1;
  return page;
}