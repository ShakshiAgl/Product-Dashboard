# Product Admin Dashboard

A small admin dashboard built with Next.js, React, Tailwind CSS and Axios, using the
free [DummyJSON](https://dummyjson.com) API. Built as a frontend assignment.

## Live demo
https://product-dashboard-fawn-seven.vercel.app

## Tech stack
- Next.js 16 (App Router)
- React
- Tailwind CSS
- Axios (all API calls go through one shared instance)
- No React Query / SWR / table libraries — pagination, sorting and search are hand-written

## Setup

```bash
git clone <your-repo-url>
cd product-dashboard
npm install
npm run dev
```

Open http://localhost:3000. It redirects to the login page.

**Login credentials (from DummyJSON):**
- Username: `emilys`
- Password: `emilyspass`

No environment variables are needed — the API base URL (`https://dummyjson.com`) is
set directly in `src/lib/axios.js`.

## What's finished

- [x] Login with error handling on wrong credentials, token stored in a cookie, logout button
- [x] Route protection — logged-out users can't open `/products` or its sub-pages
- [x] Product list: table on desktop, cards on mobile
- [x] Pagination: page numbers, Previous/Next, page size (10/20/50), "Showing X–Y of total"
- [x] Debounced search (`/products/search`), with old results never overwriting new ones
  (verified with `&delay=2000`)
- [x] Category filter (`/products/categories`) and sort by price/rating/title
- [x] Product details page (`/products/[id]`) with images, description, price, reviews
- [x] "Not found" page for a bad or missing product id
- [x] Add / edit product forms with validation
- [x] Delete with a confirm dialog
- [x] Loading, empty and error states (with Retry) on every data-fetching page
- [x] All list state (page, limit, search, category, sort) lives in the URL
- [x] Invalid URL values (`?page=abc`, `?page=999`) are handled without breaking the page
- [x] Double-click / rapid-click protection on Login, Save and Delete-confirm
- [x] Restyled UI (cream/ivory theme, serif headings) — visual polish only, no change
  to data, fields, or behavior described above

## Project structure

src/
app/
layout.js Root layout (fonts, global styles)
globals.css Tailwind import + design tokens
page.js Redirects "/" to "/products"
login/
page.js Login page
(dashboard)/
layout.js Shared header + logout, wraps all product pages
products/
page.js Product list: search, filters, sort, pagination, delete
new/
page.js Add product form
[id]/
page.js Product details
not-found.js "Product not found" page
edit/
page.js Edit product form
components/ Small, reusable UI pieces (list, form, pagination,
search box, filters, dialogs, states, etc.)
hooks/ useDebounce, useListParams, useCategories
lib/
axios.js Shared Axios instance + request/response interceptors
token.js Cookie-based token storage
params.js URL param parsing/validation + page clamping
overlay.js sessionStorage overlay for add/edit/delete (see NOTES.md)
services/
auth.service.js Login API call
product.service.js All product-related API calls
proxy.js Route guard — redirects unauthenticated users to /login
(named middleware.js on Next <16)



## Notes on two specific decisions

See `NOTES.md` for the reasoning behind:
- what happens when search and category filter would otherwise be used together
- how add/edit/delete "work" against an API that doesn't actually persist changes
- a couple of real bugs hit during development and how they were fixed


