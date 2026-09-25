# Product Admin Dashboard

A small admin dashboard built with Next.js, React, Tailwind CSS and Axios, using the
free [DummyJSON](https://dummyjson.com) API. Built as a frontend assignment.

## Live demo
[link here after deploying]

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

## Project structure