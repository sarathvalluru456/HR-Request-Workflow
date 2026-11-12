# PolicyFlow

## Implementation approach

PolicyFlow is a focused HR operations workspace for resolving routine requests against versioned policy sources, routing sensitive work, and exposing SLA outcomes. The first release is a polished, data-rich dashboard shell with deterministic synthetic records in the frontend so the core workflow is demonstrable immediately in Preview. The UI models the required entities and edge cases through ticket cards, policy evidence, exception review, and dataset validation metadata; the starter's server/database remain available for a later persistence pass.

The main page is a responsive single-route React experience. The left rail provides workspace navigation; the primary surface combines queue health, SLA distribution, ticket triage, policy lineage, and validation state. Interactions are local and purposeful: queue filters change the visible ticket set, search narrows tickets, opening a ticket reveals its evidence trail, and the exception review control focuses the audit queue. No product area mentions an assistant or generated content.

## Project structure

- `client/src/pages/Home.tsx` — main PolicyFlow workspace, mock domain data, filters, ticket drawer, and dashboard sections.
- `client/src/index.css` — visual system, responsive layout, card treatments, status language, and motion.
- `client/public/manus-routes.json` — declared page route manifest for the Webdev runtime.
- `app.config.ts` — project logo metadata.
- `TODO.md` — source acceptance criteria and delivery outcomes.

## Design direction

Three sampled directions considered:

- **Swiss operations ledger** — 0.07
- **Editorial casebook** — 0.05
- **Industrial control room** — 0.08

Chosen: **Swiss operations ledger**.

- **Design Movement:** Modernist Swiss editorial design translated into a quiet internal operations tool: strict typographic hierarchy, measured alignment, and occasional cobalt annotations.
- **Core Principles:** Make evidence more visible than decoration; use whitespace to separate responsibility; make exceptions impossible to miss; make every number feel sourced.
- **Color Philosophy:** A warm paper canvas and blue-black ink feel calm and trustworthy for HR work. Cobalt is reserved for active workflow and evidence links. Amber and coral are only for attention states, so risk reads immediately.
- **Layout Paradigm:** An anchored left rail and a staggered evidence canvas. Key metrics sit in a narrow top band; the queue and policy lineage occupy the main split; a low-contrast validation strip anchors the page.
- **Signature Elements:** Hairline dividers, compact uppercase section labels, and a cobalt “source pin” treatment for policy evidence.
- **Interaction Philosophy:** Interactions should feel like moving a case file, not opening a modal-heavy app. Filters update in place; selected tickets gain a quiet blue edge; drawers preserve the surrounding context.
- **Animation:** Use short 160–220ms opacity/translate transitions for panels and a subtle bar-fill entrance for metrics. Avoid bouncing, gradients, or attention-seeking motion.
- **Typography System:** Use `DM Sans` for interface copy and `Space Mono` for IDs, timestamps, counters, and source references. Headlines are compact and slightly tracked; supporting copy stays human and direct.
- **Brand Essence:** Versioned policy work for people teams who need the answer, the source, and the next action in one place. Personality: exact, composed, accountable.
- **Brand Voice:** Headlines are declarative and operational. CTAs are specific. Example lines: “Review what needs a human decision.” “Open the source before you close the case.”
- **Wordmark & Logo:** A small outlined square split by a diagonal rule, representing a policy version becoming a decision; paired with a compact lowercase wordmark.
- **Signature Brand Color:** Cobalt `#2457d6`, used as the ownable action and evidence color against the paper canvas.
