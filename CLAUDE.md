# CLAUDE.md

This file provides project-specific guidance for Claude Code when working in this repository.

This project is a static frontend project using simple web technologies.

Preferred stack:

```text
HTML
CSS
Vanilla JavaScript
jQuery where useful or already present
Bootstrap
```

The goal is to keep the project simple, clean, responsive, easy to deploy, and easy to maintain.

---

## 1. General Working Style

When working on this project:

- First inspect the existing files before making changes.
- Keep changes small and easy to review.
- Do not introduce heavy frontend frameworks.
- Do not convert the project to React, Vue, Angular, Svelte, Next.js, or any build-based setup unless explicitly asked.
- Prefer simple HTML, CSS, Bootstrap, and JavaScript.
- Preserve existing functionality unless asked to change it.
- Keep the UI clean, modern, responsive, and lightweight.
- Avoid over-engineering.
- Avoid unnecessary dependencies.
- Keep the project deployable as static files.

After making changes, summarize:

- files changed
- what changed
- how to test locally
- any assumptions

---

## 2. Project Type

This is usually a simple static frontend project.

Typical structure:

```text
project-root/
├── index.html
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   ├── images/
│   └── data/
│       └── data.json
├── README.md
└── Makefile
```

For very small projects, this structure is also acceptable:

```text
project-root/
├── index.html
├── style.css
├── script.js
└── README.md
```

Do not force a complex structure for a small project.

---

## 3. Design Style Preference

The UI should look:

- clean
- modern
- professional
- lightweight
- mobile-friendly
- easy to understand
- visually balanced

Prefer:

- Bootstrap layout utilities
- cards
- badges
- icons
- clean spacing
- soft borders
- subtle shadows
- clear typography
- responsive grids
- simple navigation
- meaningful empty states

Avoid:

- cluttered UI
- too many colors
- poor spacing
- tiny unreadable text
- unnecessary animations
- confusing interactions
- large blocks of unstructured text
- overly decorative design that hurts usability

---

## 4. Bootstrap Guidelines

Bootstrap is preferred for layout and common components.

Use Bootstrap for:

- responsive containers
- grid layout
- cards
- buttons
- forms
- modals
- navbars
- accordions
- tables
- badges
- alerts

Prefer Bootstrap utility classes where they make the HTML clearer.

Example:

```html
<div class="container py-4">
  <div class="row g-3">
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card shadow-sm border-0">
        <div class="card-body">
          <h5 class="card-title">Title</h5>
          <p class="card-text text-muted">Description</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

Do not overuse custom CSS when Bootstrap already solves the problem cleanly.

---

## 5. CSS Guidelines

Custom CSS should be clean and minimal.

Prefer:

- CSS variables for theme colors
- reusable utility classes
- readable selectors
- responsive media queries
- consistent spacing
- simple hover/focus states

Avoid:

- deeply nested selectors
- `!important` unless truly needed
- duplicate styles
- huge CSS files
- hardcoded random spacing everywhere
- styling that breaks mobile layout

Good example:

```css
:root {
  --app-bg: #f8f9fa;
  --app-card-radius: 16px;
}

body {
  background: var(--app-bg);
}

.app-card {
  border-radius: var(--app-card-radius);
}
```

---

## 6. JavaScript Guidelines

Keep JavaScript simple and readable.

Prefer:

- clear function names
- small functions
- simple DOM manipulation
- event delegation where useful
- data-driven rendering
- readable state variables

Avoid:

- complex state management
- unnecessary classes
- global variables spread everywhere
- deeply nested callbacks
- duplicated DOM manipulation
- mixing too much HTML generation in many places

Good function names:

```js
renderCategoryList();
renderProductCard(product);
updateSummaryCounts();
handleSearchInput();
loadDashboardData();
```

Avoid vague names:

```js
doStuff();
processData();
handleClick();
```

---

## 7. jQuery Guidelines

jQuery is allowed if already used or if it makes the code simpler.

Use jQuery for:

- simple selectors
- event handling
- simple DOM updates
- Bootstrap component interactions

Avoid using jQuery in a messy way.

Good:

```js
$("#searchInput").on("input", function () {
  const searchText = $(this).val().trim().toLowerCase();
  filterItems(searchText);
});
```

Avoid:

```js
$("div").children().children().eq(2).html("...");
```

Prefer meaningful IDs and classes.

---

## 8. Data Handling Guidelines

For static projects, using JSON files is acceptable.

Preferred location:

```text
assets/data/data.json
```

Use JSON for:

- static content
- dashboard data
- mock data
- list data
- configuration-like data

Keep JSON clean and predictable.

Example:

```json
{
  "items": [
    {
      "id": "item_001",
      "name": "Sample Item",
      "category": "Category A",
      "status": "active"
    }
  ]
}
```

When rendering from JSON:

- handle loading state
- handle empty state
- handle error state
- avoid breaking the page if a field is missing

---

## 9. Responsiveness Guidelines

Mobile-first behavior is important.

The page should work well on:

- mobile phones
- tablets
- desktop screens

For mobile:

- avoid crowded tables
- use cards when tables become unreadable
- keep buttons large enough to tap
- use collapsible sections where useful
- keep filters/search easy to access
- ensure text is readable
- avoid horizontal scrolling

Use Bootstrap breakpoints:

```text
col-12
col-sm-*
col-md-*
col-lg-*
col-xl-*
```

Test layouts by resizing the browser.

---

## 10. UI Component Guidelines

Common useful components:

### Cards

Use cards for summary blocks, product/items, dashboard panels, and grouped content.

### Accordions

Use accordions for collapsible categories/subcategories.

Good for:

- inventory apps
- FAQ pages
- grouped dashboards
- nested content

### Badges

Use badges for statuses and counts.

Examples:

```text
Finished
In Use
Pending
Active
3 / 10
```

### Empty States

Always show a friendly empty state when there is no data.

Example:

```text
No items found. Try changing your search or filters.
```

### Search and Filters

For list-heavy pages, add simple search/filter controls.

Keep them obvious and easy to use.

---

## 11. Icon Guidelines

Icons are encouraged where they improve clarity.

Preferred options:

- Bootstrap Icons
- Font Awesome if already used
- inline SVG only when simple

Use icons for:

- actions
- statuses
- categories
- navigation
- dashboard summary cards

Do not overload the UI with icons.

Every icon should support meaning, not just decoration.

---

## 12. Accessibility Guidelines

Keep basic accessibility in mind.

Prefer:

- semantic HTML
- proper button elements for actions
- labels for form fields
- alt text for meaningful images
- sufficient contrast
- keyboard-friendly interactions
- visible focus states

Avoid:

- clickable `<div>` elements when a `<button>` is better
- removing outlines without replacement
- relying only on color to communicate status

---

## 13. Performance Guidelines

Static projects should be lightweight.

Prefer:

- small CSS
- small JS
- optimized images
- minimal dependencies
- CDN usage where appropriate
- simple DOM updates

Avoid:

- huge libraries for tiny features
- loading unnecessary scripts
- excessive animations
- rendering large HTML repeatedly without need

---

## 14. Deployment Guidelines

The project should be easy to deploy on static hosting platforms like:

- Cloudflare Pages
- GitHub Pages
- Netlify
- Vercel static hosting

Avoid requiring a backend unless explicitly needed.

If fetch is used for local JSON files, remember that opening `index.html` directly from the filesystem may fail due to browser restrictions. Prefer running a simple local server.

Example:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

---

## 15. Makefile Guidelines

For static frontend projects, a simple Makefile is useful.

Example:

```makefile
serve:
	python3 -m http.server 8000

clean:
	find . -name ".DS_Store" -delete
```

Optional targets:

```makefile
format:
	npx prettier --write .

check:
	npx prettier --check .
```

Do not add Node tooling unless the project already uses it or the user asks for it.

---

## 16. README Guidelines

README should include:

- project name
- short description
- tech stack
- folder structure
- how to run locally
- how to deploy
- how to update data/content

Example sections:

```md
# Project Name

## Overview

## Tech Stack

## Folder Structure

## Run Locally

## Update Data

## Deployment
```

Keep README practical, not overly long.

---

## 17. Content and Copy Guidelines

Text on the page should be:

- clear
- friendly
- concise
- professional
- easy to scan

Avoid long paragraphs when cards, sections, or bullets would be clearer.

Use meaningful headings.

Bad:

```text
Welcome to our website where you can find all types of details and lots of different information.
```

Good:

```text
Explore biodiversity insights by state, district, and ecosystem.
```

---

## 18. Do Not Change Without Approval

Do not change these unless explicitly asked:

- project name
- branding
- color theme
- data schema
- deployment setup
- external CDN choices
- major layout direction
- existing working functionality

For visual improvements, preserve the existing intent and functionality.

---

## 19. Claude Code Workflow Rules

When Claude Code is asked to modify this project:

1. Inspect the current files first.
2. Understand the current layout and behavior.
3. Explain the planned changes.
4. Keep changes minimal.
5. Modify only necessary files.
6. Preserve existing functionality.
7. Check responsiveness.
8. Summarize the final changes.

For larger redesigns:

- propose the design direction first
- do not rewrite the full UI without approval
- work section by section

---

## 20. Common Tasks Claude Should Handle Well

Claude may be asked to:

- improve mobile responsiveness
- clean up the layout
- create a better homepage
- add cards, accordions, filters, or search
- render JSON data into UI
- improve spacing and typography
- add Bootstrap-based components
- create a README
- prepare the project for Cloudflare Pages
- refactor messy JavaScript
- organize assets into folders
- add a simple local server Makefile target

Always keep the result simple and static-hosting friendly.

---

## 21. Things to Avoid

Avoid:

- converting to React/Vue/Angular
- adding bundlers like Vite/Webpack unless asked
- adding package.json unless needed
- adding unnecessary animations
- using complex state management
- making UI too flashy
- breaking mobile layout
- hiding important content behind too many interactions
- duplicating HTML unnecessarily
- using unclear class names
- making changes that require a backend

---

## 22. Preferred Final Response After Changes

After making changes, respond with:

```text
Changed files:
- index.html: reason
- assets/css/style.css: reason
- assets/js/app.js: reason

What changed:
- short bullet summary

How to test:
- run: python3 -m http.server 8000
- open: http://localhost:8000

Notes:
- assumptions
- anything not changed
```

Keep the summary simple and practical.
