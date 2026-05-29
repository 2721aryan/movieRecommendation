# NFLIX — Frontend

Next.js 16 frontend for the NFLIX Movie Recommendation System. Built with React 19, TypeScript, Tailwind CSS, and Framer Motion.

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Next.js | 16.2.6 | React framework (App Router) |
| React | 19.2.4 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first styling |
| Framer Motion | 12.x | Page and component animations |
| Lucide React | 1.14.0 | Icon set |

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
# Create a .env.local file in this directory:
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** The backend must be running on port 8000 for API calls to succeed. See `../backend/README.md` for backend setup.

---

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout (AuthProvider)
│   ├── globals.css           # Global styles
│   ├── (auth)/
│   │   ├── login/page.tsx    # Login page
│   │   └── signup/page.tsx   # Sign-up page
│   └── (main)/
│       ├── browse/           # Browse page (movie rows)
│       ├── movie/[id]/       # Dynamic movie detail page
│       ├── search/           # Search with genre filters
│       ├── my-list/          # User's saved watchlist
│       └── profile/          # Profile selection & management
│
├── components/
│   ├── auth/                 # AuthForm (shared login/signup)
│   ├── layout/               # Navbar, AppShell, Footer
│   ├── movie/                # MovieCard, MovieRow, MovieMeta, SimilarMoviesRow
│   ├── search/               # SearchBar, GenreFilter
│   ├── profile/              # ProfileSelector, ProfileCard
│   └── ui/                   # Button, Modal (reusable primitives)
│
├── context/
│   └── AuthContext.tsx       # Global auth + watchlist + likes state
│
├── hooks/
│   ├── useAuth.ts            # Exposes AuthContext values
│   └── useSearch.ts          # Debounced search logic
│
├── lib/
│   ├── api.ts                # Typed HTTP client (GET, POST)
│   ├── constants.ts          # APP_NAME, API_BASE_URL, SEARCH_DEBOUNCE_MS
│   └── tmdb-image.ts         # TMDB image URL builders
│
├── services/
│   ├── movie.service.ts      # API calls for movies & interaction logging
│   └── user.service.ts       # API calls for watchlist management
│
└── types/
    ├── movie.ts              # Movie, CastMember interfaces
    └── auth.ts               # User, Profile, AuthState interfaces
```

---

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Hero, features, CTA — public |
| `/login` | Login | Email + password form |
| `/signup` | Sign Up | Registration form |
| `/browse` | Browse | Categorised movie rows |
| `/movie/[id]` | Movie Detail | Full metadata, like/watchlist, similar movies |
| `/search` | Search | Real-time title search + genre filters |
| `/my-list` | My List | User's saved watchlist |
| `/profile` | Profile | Select / manage viewer profiles |

---

## State Management

Global state is managed via **React Context API** (`AuthContext`). No Redux or Zustand — intentionally lightweight.

The context provides:
- `user` — authenticated user object (with profiles)
- `isAuthenticated` — boolean auth flag
- `myList` — full Movie objects in the watchlist
- `likedMovies` — array of liked movie IDs
- `dislikedMovies` — array of disliked movie IDs
- Actions: `login`, `signup`, `logout`, `addToMyList`, `removeFromMyList`, `toggleLike`, `toggleDislike`

State is persisted in **two layers**:
1. **Backend DB** — watchlist (watchlist table) and likes (interactions table)
2. **localStorage** — instant restoration on reload; offline fallback

---

## Environment Variables

| Variable | Example | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Yes |

---

## Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Run production build
npm run lint     # ESLint check
```

---

## Deployment

Deploy to [Vercel](https://vercel.com) (recommended — zero config for Next.js):

1. Push this folder (or the whole repo) to GitHub
2. Import the repo on vercel.com
3. Set the root directory to `frontend/`
4. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url`
5. Deploy
