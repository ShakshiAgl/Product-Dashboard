const KEY = "product-overlay";

function read() {
  if (typeof window === "undefined") return { added: [], edited: {}, deletedIds: [] };
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { added: [], edited: {}, deletedIds: [] };
  } catch {
    return { added: [], edited: {}, deletedIds: [] };
  }
}

function write(overlay) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(overlay));
  } catch {
    // sessionStorage can fail in some private-browsing modes; fail silently,
    // the app still works, it just won't remember changes after a refresh.
  }
}

export const overlayStore = {
  addProduct(product) {
    const overlay = read();
    overlay.added = [product, ...overlay.added];
    write(overlay);
  },
  editProduct(id, changes) {
    const overlay = read();
    overlay.edited[id] = { ...overlay.edited[id], ...changes };
    write(overlay);
  },
  deleteProduct(id) {
    const overlay = read();
    if (!overlay.deletedIds.includes(id)) overlay.deletedIds.push(id);
    write(overlay);
  },
  // Merge the overlay onto a list of products fetched from the API.
  applyToList(products) {
    const overlay = read();
    const withEdits = products
      .filter((p) => !overlay.deletedIds.includes(p.id))
      .map((p) => (overlay.edited[p.id] ? { ...p, ...overlay.edited[p.id] } : p));
    return [...overlay.added, ...withEdits];
  },
  // Merge the overlay onto a single product (for the details page).
  applyToOne(product) {
    const overlay = read();
    if (overlay.deletedIds.includes(product.id)) return null;
    return overlay.edited[product.id] ? { ...product, ...overlay.edited[product.id] } : product;
  },
  getAdded(id) {
    const overlay = read();
    return overlay.added.find((p) => p.id === id) || null;
  },
};