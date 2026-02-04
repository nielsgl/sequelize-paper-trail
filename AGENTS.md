# Repository Guidelines

## Project Structure & Module Organization
- `lib/` holds the source code (`index.js`, `helpers.js`). Build output goes to `dist/` via Babel.
- `test/` contains Jest tests (e.g., `*.spec.js`) plus fixtures under `test/models/` and `test/migrations/`.
- `config/config.json` supplies test database config (SQLite in-memory).
- `docs/PLAN.md`, `docs/PROJECT.md`, `docs/TESTS.md`, and `docs/CI.md` capture the roadmap, project reference, test strategy, and CI intent.
- Root config files include `.eslintrc`, `.prettierrc`, and `.editorconfig` for shared tooling rules.

## Build, Test, and Development Commands
- `npm run build` — transpile `lib/` to `dist/` with Babel (also runs on `npm prepare`).
- `npm test` — run the Jest test suite.
- `npm run lint` — lint `lib/`, `test/`, and `examples/` with ESLint + Prettier rules.
- `npm run lint:fix` — auto-fix lint issues where possible.
- `npm run release` — publish via `release-it` (maintainers only).

## Coding Style & Naming Conventions
- Indentation: tabs with width 4 (see `.editorconfig` and `.prettierrc`).
- Quotes: single quotes; trailing commas enabled.
- Linting: ESLint (Airbnb base) + Prettier; Flowtype lint rules are enabled where Flow annotations exist.
- Test files follow `*.spec.js` naming (see `test/`).

## Testing Guidelines
- Framework: Jest (`npm test`).
- Prefer adding or updating tests alongside code changes; locate integration-style fixtures in `test/models/` and `test/migrations/`.
- The README notes limited coverage; use `docs/TESTS.md` to guide comprehensive, user‑journey coverage.
- Use `npm run test:v6` for Sequelize v6 compatibility checks.

## Commit & Pull Request Guidelines
- Git history favors short, imperative summaries and release-style commits (e.g., “Release 3.0.1”, “Fix indent”).
- Keep commits focused; if you touch behavior, include tests or explain why not.
- PRs should include a clear description, steps to validate, and any linked issues. Include migration notes or README updates when behavior changes.

## PRD Workflow
- Each phase of the modernization plan should start with a local PRD at `docs/prd_{phase}.md`.
- Do not commit PRD files (they are ignored in `.gitignore`).

## Configuration Tips
- Node version is pinned in `.node-version` (20.20.0). Align your local environment for reproducible builds.
- Test DB is SQLite in-memory via `config/config.json`; no external services required.
- On modern macOS, Node 20.20.0 with Python 3.9.19 may be required for sqlite3 native builds.
- npm is the canonical package manager (lockfile: `package-lock.json`).
