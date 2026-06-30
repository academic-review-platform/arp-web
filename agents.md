## Project Context

Note Validator is a web application where teachers publish bibliography, students upload notes, and an AI system validates those notes against the bibliography as the source of truth.

The frontend is a SPA built with React + Vite and must act as the orchestration layer for:

* authentication and session persistence
* dashboard navigation
* course and subject management
* bibliography publishing and reading
* note upload, GitBook synchronization, and validation flows
* AI result visualization
* partial offline behavior and persistent cache

This document is prescriptive. Any implementation that conflicts with it must be treated as a design issue, not a coding preference.

## Design Source of Truth

Figma is the primary source of truth for layout, hierarchy, spacing, component reuse, and responsive behavior.

Before implementing any new screen or changing an existing one, the agent must:

* inspect the relevant Figma screens
* infer hierarchy, layout, navigation, and reusable components
* identify missing states and edge cases
* stop and ask questions if critical information is missing

If Figma is incomplete or unavailable for a screen, do not invent a final UI silently. Ask for clarification first.

When no new design is provided, default to a dashboard-first layout with a lateral sidebar and top-level content area.

## Stack

The frontend must use:

* React
* Vite
* TypeScript with `strict: true`
* MUI
* Axios
* React Router DOM
* Zustand
* Formik
* Yup
* ESLint

No Redux. No Context API for global auth. No alternate form library.

## Architecture Principles

The codebase must follow a lightweight clean architecture approach.

Core rules:

* separate UI from business logic
* separate API contracts from frontend models
* keep pages thin and compositional
* keep services isolated from rendering
* keep auth and persistence outside components
* keep reusable logic in shared helpers/hooks/services
* keep feature-specific logic out of generic UI components

The architecture must scale without becoming over-engineered.

## Folder Responsibilities

### `assets/`

Static images, icons, illustrations, and non-code resources.

### `components/`

Reusable presentational and composable UI components only.

### `constants/`

Immutable values, route constants, labels, status enums, and UI tokens.


### `helper/`

Small domain-agnostic helper functions that do not justify a dedicated service.

### `hooks/`

Reusable React hooks for UI behavior, orchestration, and shared logic.

### `layout/`

Application shells, sidebar layouts, dashboard layout, auth layout, and structural wrappers.

### `locales/`

Translation resources and localization files, even if i18n is not enabled initially.

### `models/`

Frontend domain models and typed structures that represent normalized application data.

### `pages/`

Route-level screen compositions. Pages must remain thin.

### `pdfs/`

PDF-related assets, preview helpers, document render helpers, and PDF-specific UI support.

### `routes/`

Route definitions, route guards, protected route wrappers, and route grouping.

### `services/`

All API access, transport logic, GitBook integration, upload workflows, and data retrieval services.

### `store/`

Zustand stores for auth, session persistence, and minimal shared global state.

### `theme/`

MUI theme, palette, typography, spacing, breakpoints, component overrides, and design tokens.

### `utils/`

Pure utility functions with no UI or transport dependencies.

## File and Naming Conventions

Use these conventions consistently:

* components: `PascalCase`
* hooks: `useSomething`
* services: `somethingService.ts`
* stores: `somethingStore.ts`
* models: `something.model.ts`
* schemas: `something.schema.ts`
* helpers/utilities: `camelCase`
* route constants: `UPPER_SNAKE_CASE`
* folders: `kebab-case` or clear domain names, but remain consistent

Do not mix naming styles within the same area.

## Routing

The app must use React Router DOM with route-based code splitting.

Route groups must be organized conceptually as:

* public routes
* auth routes
* protected dashboard routes

The route structure must support:

* login and authentication flows
* dashboard shell with sidebar navigation
* protected pages for teachers and students
* lazy-loaded screens

All pages must be loaded lazily when practical.

## Layout Rules

The main UI must be dashboard-first and use a lateral sidebar as the primary navigation pattern.

The standard layout model is:

* sidebar for main navigation
* top bar for context actions, profile, and page-level utilities
* content area for routes and feature screens

Use responsive behavior:

* sidebar collapsed or drawer on smaller screens
* content layout must adapt without breaking hierarchy
* mobile support must remain functional even if desktop is the primary target

## Authentication

Authentication is JWT-based.

### Auth State

Authentication state must be managed with Zustand only.

The auth store must hold:

* access token
* user profile
* authentication status
* session hydration status
* token expiration state when available

### Token Storage

Store the JWT in `localStorage`.

Do not read or write the token directly from components or pages. All access must go through a dedicated storage abstraction.

### Auth Rules

* no Context API for auth
* no Redux for auth
* no direct API calls from UI to determine auth state
* no token parsing inside components unless wrapped by a helper
* no UI rendering logic should depend on raw token shape

### Session Persistence

On app startup:

1. hydrate auth from persistent storage
2. validate token presence
3. verify expiration if available
4. restore session state
5. redirect if the session is invalid

### Expired or Invalid Session

When the token is invalid or expired:

* clear auth state
* clear persisted token
* invalidate sensitive cached data
* redirect to login

## Axios and API Layer

All backend communication must go through the services layer.

The UI must never import or use Axios directly.

### API Flow

The required flow is:

UI → hooks → services → Axios client → backend

### Axios Rules

Create one centralized Axios client with:

* base URL from environment variables
* request interceptor for auth token injection
* response interceptor for centralized error handling
* support for 401 handling
* optional retry behavior only for safe requests

### Endpoint Groups

The frontend must support these backend domains explicitly:

* AUTH
* USERS
* COURSES
* SUBJECTS
* NOTES
* BIBLIOGRAPHIES

### API Rules

* do not hardcode endpoints in pages or components
* do not duplicate request logic
* do not use raw response objects in UI
* do not trust backend payload shape inside components
* do not scatter error handling across the app

### DTO and Mapping Rules

Every response must be normalized through adapters or mappers before reaching the UI.

Use this separation:

backend DTO → mapper → frontend model → UI

Frontend components must render frontend models, not backend DTOs.

### Error Handling

Errors must be centralized and typed.

The system must normalize:

* network errors
* validation errors
* auth errors
* upload errors
* GitBook integration errors
* unexpected server errors

Do not expose raw backend error structures directly in the interface.

## GitBook Integration

GitBook is used for:

* note text storage
* note reading
* embedded rendering
* text editing support

GitBook integration must remain isolated inside services and helpers. The UI should only consume normalized data.

### Required Note Flow

For notes, the flow is:

1. student uploads or edits the note
2. content is created or updated in GitBook
3. GitBook returns the relevant URL and page ID
4. the frontend sends the URL and page ID to the backend
5. the backend stores metadata and validation context

### GitBook Rules

* never call GitBook from pages directly
* never mix GitBook logic with UI rendering
* never let GitBook-specific response shapes leak into components
* keep GitBook editor/read logic reusable

## Bibliography Flow

Bibliography is stored directly through the backend REST API.

The bibliography flow must remain separate from GitBook note storage.

## Uploads

The frontend must support these file types:

* PDF
* DOCX
* Markdown

### Upload Rules

* uploads must be managed through services
* forms must not contain upload transport logic
* upload progress must be supported when the backend allows it
* upload failures must be handled centrally
* upload payload transformation must happen outside the UI

### Validation Rules

Upload validation must check:

* file type
* file size
* required fields
* async constraints when needed

## Forms

Formik is mandatory for all forms. Yup is mandatory for validation.

### Form Rules

* no ad hoc form handling in components
* no duplicated validation logic
* no API logic inside form rendering
* no direct mutation of backend payloads in UI
* no hardcoded validation rules in JSX

### Form Structure

Each form should follow this flow:

* schema in `schemas/`
* UI inputs in `components/`
* orchestration in `pages/` or dedicated hooks
* submit logic in `services/` or feature hooks
* errors mapped through centralized error handling

### Complex Forms

For complex flows:

* split form sections into small components
* keep field groups reusable
* isolate async validation
* keep upload logic outside the form view
* normalize payloads before submission

## State Management

Zustand must remain lightweight.

### Allowed Zustand Usage

Use Zustand for:

* auth/session state
* persistence-related UI state
* small shared dashboard state
* minimal cross-page UI flags

### Disallowed Zustand Usage

Do not use Zustand for:

* form state
* server cache
* large normalized entity graphs
* business logic orchestration that belongs in services/hooks
* duplicate state already owned by the backend or route

### State Separation

Use the right tool for the job:

* local component state for local UI concerns
* Zustand for lightweight global state
* services/hooks for server data and workflows

## Partial Offline Mode and Persistent Cache

The app supports partial offline behavior and persistent cache.

### Cache Strategy

Persist only lightweight and safe data, such as:

* authenticated session data
* recently accessed dashboard metadata
* recently opened bibliography references
* recently viewed note metadata

### Cache Rules

* do not persist sensitive data unnecessarily
* do not store raw API responses without normalization
* do not persist form drafts unless explicitly designed
* do not let cache become a second source of truth for server records

Use cache only as a support layer, not as the canonical state.

## MUI and UI System

MUI is the only UI framework.

### Theme Rules

All visual design must come from the MUI theme system:

* palette
* typography
* spacing
* breakpoints
* shadows
* component overrides

### Styling Rules

Prefer, in order:

1. theme-aware `sx`
2. MUI styled API
3. reusable styled wrappers

Avoid:

* complex inline styles
* duplicated style objects
* hardcoded colors
* hardcoded spacing values where theme tokens exist
* mixing multiple styling systems

### Accessibility Rules

All UI must support:

* semantic structure
* keyboard navigation
* proper labels
* accessible dialogs and forms
* visible focus states
* readable contrast

### Component Composition

Components must be:

* small
* reusable
* explicit in props
* predictable in behavior
* easy to test later

Do not build giant components that combine layout, data, and business logic.

## TypeScript Rules

TypeScript strict mode is mandatory.

### Type Safety Rules

* avoid `any`
* prefer explicit interfaces or type aliases
* type service responses
* type form values
* type route params
* type store state
* type mapper inputs and outputs

### Type Boundaries

Do not expose backend DTOs directly as UI props.

Always convert data to frontend-safe models.

## Services and Utilities

### Services

Services handle:

* REST requests
* GitBook communication
* upload transport
* auth session operations
* backend-to-frontend data retrieval

Services must not render UI.

### Helpers and Utils

Use helpers and utilities only for pure logic.

Do not place:

* API calls
* DOM operations
* auth persistence
* complex state logic
  inside generic utils.

## ESLint Expectations

The codebase must be aligned with ESLint rules for:

* React
* React Hooks
* TypeScript
* imports
* unused imports
* Vite-friendly ESM structure

Recommended coverage:

* `@typescript-eslint`
* `eslint-plugin-react`
* `eslint-plugin-react-hooks`
* `eslint-plugin-import`
* `eslint-plugin-unused-imports`

Lint rules must reinforce the architecture, not fight it.

## Prohibitions

The following are forbidden:

* logic API inside components
* complex logic inside pages
* direct Axios access from UI
* hardcoded endpoints
* giant components
* duplicated forms
* excessive Zustand usage
* inline complex styles
* mixing business logic with rendering
* backend DTOs leaking into UI
* feature-specific logic inside generic shared components
* bypassing Figma when design exists
* inventing UI details when critical design information is missing

## Workflow Rules

### Before Implementing a Screen

1. inspect the Figma design
2. identify layout, hierarchy, and states
3. verify the required API flow
4. confirm form and validation needs
5. confirm responsive behavior
6. implement from shared building blocks first

### When Requirements Are Ambiguous

Pause and ask clarifying questions before implementing.

Do not silently choose architectural details that affect routing, layout, persistence, or data flow.

### Refactoring Rules

Refactor when:

* a page becomes too large
* a service mixes transport and mapping
* a component starts owning business logic
* a form duplicates validation logic
* a store starts holding server state

## Dev Environment Tips

Use environment variables for all external configuration.

Examples:

* `VITE_API_URL`
* `VITE_GITBOOK_API_URL`
* `VITE_GITBOOK_TOKEN` or an equivalent secure runtime token strategy

Do not hardcode:

* API base URLs
* token names
* environment-specific values
* endpoint roots
* third-party credentials

Keep environment handling centralized.

## Testing Instructions

No testing stack is required at project start.

When testing is introduced later, it should validate:

* route guards
* auth persistence
* form validation
* service adapters
* mapper correctness
* upload workflows
* critical dashboard flows

Until a testing stack is approved, do not introduce ad hoc test tooling.

## Commit Style

Use Conventional Commits.

Examples:

```txt
feat(auth): add session hydration
fix(notes): normalize GitBook upload flow
refactor(api): centralize error handling
chore(theme): update MUI tokens
```

## Pull Request Instructions

Every PR must:

* respect folder responsibilities
* avoid direct API calls in UI
* keep types strict
* keep forms separated from transport logic
* keep auth handled through Zustand and storage abstractions
* preserve responsive dashboard behavior
* include screenshots for visual changes
* mention API or schema changes explicitly when applicable

Small, focused PRs are preferred over broad mixed changes.

## Final Architecture Rules

The frontend must remain:

* SPA-first
* dashboard-oriented
* type-safe
* API-driven
* MUI-based
* form-disciplined
* service-oriented
* lightweight in state management
* strict about UI/business separation

The guiding principle is simple:

Render in components, orchestrate in hooks, fetch in services, persist in store, validate in schemas, normalize in mappers, and keep the UI independent from backend shape.
