# Notes

## Search + category filter — my decision

DummyJSON has three separate endpoints: `/products`, `/products/search?q=`, and
`/products/category/:slug`. None of them combine search text with a category filter.

I made search and category mutually exclusive: picking a category clears any active
search, and typing a search clears any active category. Whichever the user does last
wins. I considered fetching an entire category and filtering it by search text on the
client, but that would mean giving up real server-side pagination for that case, which
the assignment specifically asks for. Making the two exclusive keeps every view backed
by real `limit`/`skip` pagination from the API, at the cost of not being able to combine
them — which felt like the more honest trade-off.

## Add / edit / delete — how I made them "stick"

The DummyJSON write endpoints (`/products/add`, `PUT /products/:id`,
`DELETE /products/:id`) return a realistic success response, but don't actually save
anything — refreshing brings the old data back.

My approach: the app still calls the real endpoint (so the network request genuinely
happens and shows up in the Network tab), and on top of that I keep a small local
"overlay" — added products, edited fields per id, and deleted ids — in `sessionStorage`.
Every time the app fetches products (list or single product), it merges this overlay
on top of the API's response. So from the user's point of view, adding, editing and
deleting all behave correctly and survive a page refresh, for the length of that browser
tab's session. It's not real persistence, but it's the most honest thing achievable
against a fake backend.

One limitation I'm aware of: a locally-added product won't show up correctly if the
user searches or filters by category for it, since it only exists in the overlay and
was never returned by any real API query.

## A problem I faced

While wiring up the details page (`/products/[id]`), I initially wrote it as a Next.js
server component, since it doesn't need `useState` for its own fetch. That worked for
the list page's edits (a client component, which can read `sessionStorage`), but not
for the details page — a server component runs on the server, where `sessionStorage`
doesn't exist, so an edited product's new title showed correctly in the list but not
on its own details page after a refresh.

I fixed it by converting the details page into a client component (matching the
pattern I already used for the edit page) so the fetch and the overlay merge both
happen in the browser, where `sessionStorage` is actually available.

## Where AI helped

I used AI (Claude) as a step-by-step build guide throughout this assignment — planning
the file structure, writing the initial version of each file, and debugging errors as
I hit them (including a `ReferenceError` from a typo in my own `tokenStore.get()` that
looked exactly like a network error until we traced it through the Axios interceptor,
and the server/client component bug above). I read and understood every file before
committing it, and can walk through any line and explain why it's written the way it is.