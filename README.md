# Vue 3 + Vite + TypeScript Project

An example project built with Vue 3 + TypeScript using Vite. It integrates Vue Router, Pinia for state management, ESLint, Prettier, and Vitest for testing.

## Features and Tech Stack
- **Framework**: `vue@^3.5.12`
- **Build Tool**: `vite@^5.4.10`
- **Language**: `typescript@^5.6.3`
- **Routing**: `vue-router@^4.4.5`
- **State Management**: `pinia@^2.2.6`
- **Testing**: `vitest@^2.1.3` (with `jsdom` environment)
- **Code Quality**: `eslint@^9.12.0`, `eslint-plugin-vue@^9.30.0`, `@vue/eslint-config-typescript`, `@vue/eslint-config-prettier`, `prettier@^3.3.3`

## Requirements
- Recommended **Node.js 18+** (compatible with Vite 5)
- Use `npm` as the package manager (`package-lock.json` included)

## Quick Start
```bash
# Install dependencies
npm install

# Start dev server (default at http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally (requires prior build)
npm run preview

# Lint (ESLint)
npm run lint

# TypeScript type check
npm run type-check

# Unit tests (Vitest)
npm run test
```

## Project Structure
```
├─ index.html
├─ package.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ vite.config.ts
├─ vitest.setup.ts
├─ env.d.ts
├─ src/
│  ├─ main.ts
│  ├─ App.vue
│  ├─ assets/
│  │  └─ base.css
│  ├─ components/
│  │  ├─ AddEditArticleModal.vue
│  │  ├─ ProductDetailModal.vue
│  │  └─ SeenInModal.vue
│  ├─ data/
│  │  └─ products.ts
│  ├─ router/
│  │  └─ index.ts
│  ├─ services/
│  │  └─ blogApi.ts
│  ├─ stores/
│  │  └─ counter.ts
│  ├─ types/
│  │  ├─ blog.ts
│  │  └─ product.ts
│  └─ views/
│     ├─ AboutView.vue
│     ├─ BlogsView.vue
│     ├─ HomeView.vue
│     └─ UsersView.vue
```

## Routing (`src/router/index.ts`)
- **`/` → `HomeView.vue`**: Product gallery with modal detail views
- **`/about` → `AboutView.vue`**: Lazily loaded About page
- **`/users` → `UsersView.vue`**: CRUD UI that talks to `/api/users`
- **`/blogs` → `BlogsView.vue`**: Article management UI backed by `blogApi`

```ts
// Key snippet
routes: [
  { path: '/', name: 'home', component: HomeView },
  { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') }
]
```

## State Management (`src/stores/counter.ts`)
- Uses **Pinia** to create a simple counter store as an example for extending app state.
- Enabled in `src/main.ts` with `app.use(createPinia())`.

## Services (`src/services/blogApi.ts`)
- Wraps `fetch` calls to the `/api/blogs` backend with helpers that normalise Laravel-style response envelopes.
- Supports listing with search/sort/pagination plus create, update, delete, status toggling, and order updates.
- Relies on the Vite proxy (`/api`) so it works in development without CORS issues.

## Views Overview
- **HomeView**: Displays static product data (`src/data/products.ts`) and opens `ProductDetailModal` and `SeenInModal` components.
- **UsersView**: Directly calls `/api/users` endpoints for CRUD operations, handling validation errors and optimistic UI states.
- **BlogsView**: Uses `blogApi` for article management, including debounced search, pagination, sorting, and modal-driven create/edit flows.

## App Entry (`src/main.ts`)
- Creates the Vue app and mounts it to `#app`.
- Registers **Pinia** and **Vue Router**.
- Imports global styles from `src/assets/base.css`.

```ts
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

## Testing (Vitest)
- Configure the test environment as `jsdom` in `vite.config.ts`:
```ts
// vite.config.ts
export default defineConfig({
  plugins: [vue()],
  test: { environment: 'jsdom' }
})
```
- Run: `npm run test`

## Development Server (`vite.config.ts`)
- Adds a Content-Security-Policy header in dev mode so libraries that rely on `eval` keep working while you integrate stricter CSP later.
- Proxies `/api` requests to `http://localhost:8000`, allowing the Vue app to talk to the backend without additional CORS configuration.
- Update the proxy target if your API runs elsewhere.

## Code Style
- Use **ESLint** and **Prettier** to maintain consistent code style.
- Config files in the root: `.eslintrc.cjs`, `.prettierrc`, `.prettierignore`.
- Recommended before committing: `npm run lint` and `npm run type-check`.

## Deployment
- After building with Vite, the `dist/` static assets can be deployed to any static host (e.g., Nginx, Vercel, Netlify, GitHub Pages).
- Basic steps:
  - `npm run build`
  - Upload or point your static host to `dist/`.
- This repo ships with an Nginx config (`nginx.conf`) that also proxies `/api/` to `http://52.194.223.195:8000`. Change the upstream host before deploying to your own infrastructure.

## FAQ
- If the dev server fails to start or the build errors out, ensure your Node version is 18+ and reinstall dependencies:
```bash
rm -rf node_modules package-lock.json  # Delete manually on Windows if needed
npm install
```

## License
This example project does not specify a license. If you plan to publish it, add a suitable License as needed.
