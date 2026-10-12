<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Operating rules

- Inspect the relevant files, nearby code, configuration, and existing patterns before editing.
- Make the smallest coherent change that solves the request. Avoid unrelated refactors and speculative abstractions.
- Prefer existing utilities, dependencies, conventions, and architecture. Verify conflicts with actual project configuration before changing conventions.
- Never commit, push, open a PR, or perform another irreversible Git action unless explicitly asked.
- After editing, run relevant checks and report what passed, failed, or could not run.

## Project setup and commands

- Inspect `package.json`, the lockfile, and relevant configuration before choosing and running commands.
- Use the existing package manager and lockfile; never introduce another package manager or a competing lockfile.
- Run the available scripts appropriate to the change (format, lint, type-check, tests, build). Do not assume scripts exist.

## Next.js and architecture

- Follow the installed Next.js version's documentation and special-file conventions.
- Default to Server Components. Add `"use client"` only when client state, event handlers, effects, or browser APIs require it.
- Keep secrets, privileged integrations, database clients, and server-only dependencies out of Client Component import graphs.
- Keep route files focused on framework orchestration; move reusable logic to suitable feature or library modules when it improves clarity.
- Use Server Actions for suitable UI mutations and Route Handlers for HTTP APIs, webhooks, and integrations. Neither replaces server-side validation or authorization.
- Follow the repository's existing directory structure. If applicable, keep routes, reusable components, feature code, shared utilities, hooks, styles, and test helpers in their established locations.
- Keep dependencies flowing from shared/low-level modules toward feature-level code; avoid circular imports and unnecessary cross-feature coupling.
- Keep code near its primary use until reuse is demonstrated.

## Components, styling, and accessibility

- Inspect existing components and utilities before creating new ones. Avoid one-off abstractions unless they materially improve clarity or reuse.
- Preserve established component APIs and export conventions. Type public props clearly; forward `className` and relevant props when customization is intended.
- Use CSS Modules for component styles and keep global styles/tokens global, following existing project conventions.
- Reuse design tokens and established breakpoints. Prefer clear Flexbox/Grid layouts, `gap`, and CSS-based responsiveness.
- Keep selectors, nesting, overrides, and specificity simple. Avoid static inline styles, `!important`, hacks, duplicate declarations, unnecessary animation, and new styling dependencies.
- Keep CSS readable and aligned with component structure; make minimal edits to existing styles.
- Preserve semantic HTML, keyboard behavior, visible focus, and accessible labels/errors. Respect reduced-motion preferences. Test relevant supported viewport sizes.

## Data, security, and errors

- Follow existing data-access patterns. Separate UI, business logic, validation, and data access where useful; avoid duplicated queries or mutations.
- Never access databases or privileged services directly from Client Components. Return only data the caller needs; never expose secrets or internal records.
- Validate all untrusted input on the server using existing schemas/helpers. Enforce expected types, bounds, lengths, and collection limits; TypeScript casts are not runtime validation.
- Authenticate and authorize every protected server read/write, including record-level access, before disclosing data or changing state. Never trust client-supplied roles, ownership, tenant IDs, or permissions. UI checks are not security boundaries.
- Treat every exported Server Action as externally invocable. Validate its inputs and authorize the operation server-side.
- Keep credentials and server-only environment variables out of client bundles. Never hardcode or commit real secrets; validate required environment variables at an appropriate boundary.
- For uploads/storage, validate authorization and file constraints server-side, use scoped/short-lived URLs when available, and handle cleanup and partial failures safely.
- Use explicit typed payloads and the project's form conventions. Provide accessible validation and submission/error states; prevent duplicate submissions where needed.
- Handle errors at meaningful boundaries and follow existing response/logging conventions. Never silently swallow exceptions or expose stack traces, SQL/ORM details, secrets, or sensitive data to clients. Log useful server diagnostics without credentials or unnecessary personal data. Reuse existing notification/logging helpers.

## TypeScript and async code

- Prefer precise types, inference, `unknown` with safe narrowing, and clear names. Avoid `any`, unsafe casts, redundant annotations, and type assertions used to silence errors.
- Type public boundaries clearly; infer simple internal return types. Introduce named types for meaningful reusable shapes, not trivial one-off objects.
- Prefer guard clauses, readable control flow, and exhaustive handling of closed unions. Avoid nested ternaries and clever compact code.
- Prefer `async`/`await`. Handle rejections deliberately, parallelize only independent work, and consider cancellation/stale results in client-side async code.
- Preserve established loading, error, and consistency behavior.

## Testing and documentation

- Follow the configured test runner, file layout, naming, and shared fixtures.
- Test observable behavior, especially success/failure paths, validation, authorization, and important edge cases. Keep mocks representative; do not weaken production types to satisfy tests.
- Run targeted tests first, then broader checks as warranted. Do not test trivial re-exports or framework behavior without a project-specific reason.
- Update docs when public APIs, behavior, setup, environment variables, or contracts change. Keep comments concise and explain non-obvious decisions rather than narrating code.
- Do not manually edit generated files unless their documented workflow requires it.
