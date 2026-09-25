"use client";

import { useRef, useState } from "react";

const EMPTY = { title: "", category: "", price: "", stock: "", description: "", thumbnail: "" };

function validate(values) {
  const errors = {};
  if (!values.title.trim()) errors.title = "Title is required.";
  if (!values.category.trim()) errors.category = "Category is required.";
  if (values.price === "" || Number(values.price) <= 0) {
    errors.price = "Price must be a number greater than 0.";
  }
  if (values.stock === "" || Number(values.stock) < 0 || !Number.isInteger(Number(values.stock))) {
    errors.stock = "Stock must be a whole number, 0 or more.";
  }
  if (!values.description.trim()) errors.description = "Description is required.";
  return errors;
}

export default function ProductForm({ initialValues, onSubmit, submitLabel = "Save" }) {
  const [values, setValues] = useState({ ...EMPTY, ...initialValues });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const inFlight = useRef(false);

  function handleChange(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (inFlight.current) return;

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    inFlight.current = true;
    setSubmitting(true);
    setFormError(null);
    try {
      await onSubmit({ ...values, price: Number(values.price), stock: Number(values.stock) });
    } catch (err) {
      setFormError(err.message || "Something went wrong.");
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-5 rounded-2xl border border-[#E7E1D3] bg-white p-6">
      {formError && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </p>
      )}

      <Field label="Title" error={errors.title}>
        <input value={values.title} onChange={(e) => handleChange("title", e.target.value)} className="input" />
      </Field>

      <Field label="Category" error={errors.category}>
        <input
          value={values.category}
          onChange={(e) => handleChange("category", e.target.value)}
          className="input"
          placeholder="e.g. smartphones"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Price ($)" error={errors.price}>
          <input
            type="number"
            step="0.01"
            value={values.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Stock" error={errors.stock}>
          <input
            type="number"
            value={values.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
            className="input"
          />
        </Field>
      </div>

      <Field label="Thumbnail URL (optional)">
        <input value={values.thumbnail} onChange={(e) => handleChange("thumbnail", e.target.value)} className="input" />
      </Field>

      <Field label="Description" error={errors.description}>
        <textarea
          value={values.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={4}
          className="input resize-none"
        />
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-[#1C1917] px-4 py-2 text-sm font-medium text-white hover:bg-[#2A2521] disabled:opacity-50"
      >
        {submitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-[#8B8171]">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}