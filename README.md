# HR Request Workflow

A focused HR operations workspace for resolving routine requests against versioned policy sources, routing sensitive cases, and tracking service-level outcomes.

The interface is designed around the operational review loop: identify work that needs a human decision, inspect the effective policy source, route sensitive or ambiguous cases correctly, and retain a visible decision trail. The dashboard includes ticket triage, policy lineage, SLA watch, dataset health, exception review, and a selected-ticket evidence drawer.

## Run locally

Requirements: Node.js 20 or newer and pnpm 10.18.0 or newer.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. The development server listens on `PORT` when supplied:

```bash
PORT=3000 pnpm dev
```

For a production-style local run:

```bash
pnpm build
pnpm start
```

The project also exposes a static frontend command when backend services are not needed:

```bash
pnpm dev:static
```

## Useful commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the React/Express development server. |
| `pnpm check` | Run TypeScript diagnostics. |
| `pnpm build` | Build the Vite frontend and bundled server. |
| `pnpm start` | Serve the production build. |
| `pnpm test` | Run the Vitest test suite. |
| `pnpm db:migrate` | Apply checked-in Drizzle migrations when a database is configured. |
| `pnpm db:push` | Generate and apply schema changes after intentional schema edits. |

## What is included

The main dashboard is implemented in `client/src/pages/Home.tsx` and styled in `client/src/index.css`. It uses deterministic in-app records to demonstrate the requested workflow without requiring external data or credentials. The visible domain language covers Employee, Department, PolicyDocument, PolicyVersion, KnowledgeArticle, Ticket, Message, Category, Assignment, SLA, and Resolution concepts.

The dashboard demonstrates the required edge cases: an answer linked to an outdated policy version, a sensitive case that requires a specialist queue, an ambiguous request that needs clarification, and tickets with missing policy evidence. It also surfaces the expected baseline controls: 5,000 tickets, 150 articles, 20,000 messages, fixed seed `20261022`, primary/foreign-key checks, and reproducibility status.

## Workflow notes

The intended data-generation order is master data first, followed by dependent transactions and event history. IDs remain immutable and deterministic, using conventions such as `TKT-2026-000001`, `POL-HR-2026-001`, `VER-<policy-id>-01`, `KB-000001`, and `MSG-<ticket-id>-001`. Derived totals, statuses, scores, dates, and SLA outcomes should be calculated from source records rather than assigned independently.

Ground-truth anomaly labels are kept separate from input features. Deliberate issues should retain an `issue_type` or ground-truth label instead of silently corrupting unrelated records. Validation should cover primary-key uniqueness, foreign-key integrity, allowed enums, date ordering, lifecycle transitions, duplicate checks, arithmetic reconciliation, and fixed-seed checksum reproducibility.

## Project structure

- `client/src/pages/Home.tsx` — dashboard UI, synthetic ticket records, filters, and evidence drawer.
- `client/src/index.css` — visual system and responsive layout.
- `client/public/manus-routes.json` — declared page route manifest.
- `drizzle/schema.ts` — starter database schema, ready for domain tables to be added.
- `server/` — Express, tRPC, authentication, and database helpers from the initialized Webdev stack.
- `plan.md` — implementation and design plan.
- `TODO.md` — acceptance-facing requirements and delivery outcomes.

## Data and provenance

This interface uses synthetic records only. No confidential employee information or external dataset is required to run the project. If real or external data is added later, record its source URL, dataset/version, retrieval date, license or terms, attribution, transformations, and discarded fields before redistribution.

## Deployment

The repository is configured for the initialized Webdev stack. The server health endpoint is `/api/health`, the runtime default is port `3000`, and the production build is created with `pnpm build`. Keep private credentials in environment variables; do not commit `.env` files or database credentials.
