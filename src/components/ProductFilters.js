import Select from "./Select";

const SORT_OPTIONS = [
  { value: "", label: "Default order" },
  { value: "title-asc", label: "Title (A–Z)" },
  { value: "title-desc", label: "Title (Z–A)" },
  { value: "price-asc", label: "Price (low to high)" },
  { value: "price-desc", label: "Price (high to low)" },
  { value: "rating-asc", label: "Rating (low to high)" },
  { value: "rating-desc", label: "Rating (high to low)" },
];

export default function ProductFilters({ category, categories, sortBy, order, onCategoryChange, onSortChange }) {
  const categoryOptions = [
    { value: "", label: "All categories" },
    ...categories.map((c) => ({ value: c.slug, label: c.name })),
  ];

  // Combine sortBy + order into one dropdown value like "price-asc",
  // since two separate selects for one concept is more clicking for the user.
  const sortValue = sortBy ? `${sortBy}-${order}` : "";

  function handleSortChange(value) {
    if (!value) {
      onSortChange({ sortBy: "", order: "asc" });
      return;
    }
    const [field, dir] = value.split("-");
    onSortChange({ sortBy: field, order: dir });
  }

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-white p-3">
      <Select
        label="Category"
        value={category}
        onChange={onCategoryChange}
        options={categoryOptions}
      />
      <Select
        label="Sort by"
        value={sortValue}
        onChange={handleSortChange}
        options={SORT_OPTIONS}
      />
    </div>
  );
}