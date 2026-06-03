# LauFind - AI Agent Instructions

## Project Overview
LauFind is a React + Vite campus lost-and-found platform that helps students/staff report lost items and find recovered belongings. The app uses client-side authentication via localStorage and protects the dashboard route.

## Architecture

### Tech Stack
- **Frontend Framework**: React 19 with React Router 7 for client-side routing
- **Build Tool**: Vite 8 with HMR support
- **Styling**: Tailwind CSS 4.3 + inline styles with custom color scheme
- **Authentication**: Context API (no backend) - credentials stored in localStorage
- **Linting**: ESLint with React plugins

### Key Color Scheme
- Primary (Gold): `#c0a062`
- Secondary (Red): `#e02d1b`
- Tertiary (Green): `#17a763`
Used consistently across UI components via inline `style={}` props.

### Component Structure
```
src/
├── App.jsx              # Route definitions, AuthProvider wrapper
├── AuthContext.jsx      # User state management (signup/login/logout)
├── ProtectedRoute.jsx   # Route wrapper checking currentUser
├── main.jsx            # React root mount
├── index.css           # Global Tailwind + custom styles
└── assets/             # Static files

pages/
├── home.jsx            # Landing page with navbar, hero section
├── signin.jsx          # Login form with email/password
├── signup.jsx          # Registration form
└── dashboard.jsx       # Protected user dashboard
```

## Authentication Flow

**Data Model**: Users stored as objects in localStorage arrays
```javascript
// localStorage keys:
"users": [{ id, email, password, ...userData }]
"currentUser": { id, email, password, ...userData } // null when logged out
```

**useAuth Hook Pattern**: All pages import `{ useAuth }` from `src/AuthContext.jsx` to access:
- `currentUser` - logged-in user object or null
- `login(email, password)` - throws on invalid credentials
- `signup(userData)` - throws if email exists
- `logout()` - clears currentUser
- `loading` - true during initial localStorage check

**Protected Routes**: Dashboard wrapped in `<ProtectedRoute>` redirects unauthenticated users to `/signin`.

## Development Workflows

### Local Development
```bash
npm run dev          # Vite dev server with HMR on http://localhost:5173
npm run build        # Production build to dist/
npm run preview      # Preview built app locally
npm run lint         # ESLint check (currently failing - see below)
```

### Known Linting Issues
- Last lint run exited with code 1
- Common issues: React hook dependencies, unused imports
- Fix before committing: `npm run lint` should pass

### Form Patterns
- Use `useState` for form data, errors
- Handle changes with computed property names: `[e.target.name]: e.target.value`
- Auth exceptions trigger `setError` displayed above forms
- Redirect success with `useNavigate()` to `/dashboard`

## Styling Conventions

### Tailwind + Inline Styles Mix
- **Responsive layouts**: Use Tailwind classes (`sm:`, `md:`, `flex`, `grid`)
- **Colors & shadows**: Inline `style={{}}` for brand colors
- **Interactions**: `onMouseEnter`/`onMouseLeave` for hover effects

**Example Pattern** (from home.jsx):
```jsx
<button
  style={{ backgroundColor: "#c0a062" }}
  onMouseEnter={(e) => {
    e.target.style.transform = "translateY(-3px)";
    e.target.style.boxShadow = "0 12px 20px rgba(192, 160, 98, 0.3)";
  }}
  onMouseLeave={(e) => {
    e.target.style.transform = "translateY(0)";
    e.target.style.boxShadow = "none";
  }}
>
  Report Lost Item
</button>
```

### Avoiding Anti-Patterns
- Don't add CSS classes for brand colors—use inline styles with hex values
- Don't use CSS files for component-specific styles—keep in JSX
- Use `Fragment` for conditional renders when no wrapper needed

## Critical Integration Points

1. **Wrapping entire app with AuthProvider** (src/App.jsx) - required for useAuth() access
2. **ProtectedRoute usage** - check `currentUser && !loading` before rendering protected content
3. **localStorage side effects** - auth state persists across page reloads; clear on logout

## Common Pitfalls

- **No backend API**: All data is client-only; passwords stored in plain text (dev-only, insecure)
- **Async/await in AuthContext**: login/signup are sync; use `async/await` syntax in page handlers (signin.jsx pattern)
- **Email uniqueness**: signup() enforces unique emails by checking users array
- **Loading state**: ProtectedRoute shows "Loading..." during initial localStorage check—keep brief

## When Adding Features

- New pages go in `pages/` and import from `src/AuthContext.jsx` if auth-gated
- New forms follow signin.jsx pattern: formData state, error display, navigate() on success
- Protect dashboard/account features with ProtectedRoute wrapper
- Test all color references match the brand hex values
