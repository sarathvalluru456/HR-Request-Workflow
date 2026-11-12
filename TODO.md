# PolicyFlow delivery outcomes

## 1. End-to-end HR operations workspace
- Resolve routine HR requests using versioned policy sources, route sensitive cases and track service SLAs.
- Support the primary actors and systems: employee/candidate, manager, HR partner, IT/operations partner, and system administrator.
- Expose key decisions and exceptions, preserve traceability, and produce measurable outputs.

## 2. Domain model and traceability surface
- Represent the core entities Employee, Department, PolicyDocument, PolicyVersion, KnowledgeArticle, Ticket, Message, Category, Assignment, SLA, and Resolution.
- Define a primary key for every entity and foreign keys for every relationship; document cardinality, optional relationships, effective dates, and lifecycle states.
- Use bridge tables for many-to-many relationships, retain event history for state changes, validate all joins, and keep deliberate anomaly cases labeled with issue_type/ground_truth rather than silently corrupting unrelated rows.
- Use deterministic IDs and naming: `TKT-2026-000001`, `POL-HR-2026-001`, `VER-<policy-id>-01`, `KB-000001`, and `MSG-<ticket-id>-001`; keep counters zero-padded, IDs immutable, and referenced IDs exactly consistent.

## 3. Workflow rules and source evidence
- Generate/reference master data first: Employee, Department, PolicyDocument, PolicyVersion, and KnowledgeArticle.
- Generate dependent transaction/event records using valid parent IDs.
- Create synthetic policy documents with effective dates and audience; generate HR tickets across benefits, leave, payroll, and onboarding; define routing and escalation rules; link answer snippets to current policy versions; simulate clarification and resolution messages.
- Persist state changes as explicit records/events where relevant; do not overwrite history.
- Generate outcomes and ground-truth labels from documented rules, not independent random assignment.

## 4. Synthetic data and validation controls
- Include the baseline volumes of 5,000 tickets, 150 policy articles, and 20,000 messages, with outdated versions, ambiguous questions, confidential employee-relations cases, and missing context.
- Use fixed seed `20261022` and parameterize scale so starter and full datasets use the same generator.
- Generate valid baseline records first, then inject labeled edge cases: an answer citing an obsolete policy; a sensitive case sent to a general queue; an SLA that incorrectly excludes required business hours; and an unsupported policy claim presented as fact.
- Calculate derived totals, balances, scores, statuses, and dates from source records rather than generating them independently.
- Produce separate ground-truth CSV/JSON for known anomalies, expected decisions, or labels; never leak it into input features.
- Validate primary-key uniqueness, foreign-key integrity, allowed enums, date ordering, arithmetic reconciliation, lifecycle transitions, and duplicate checks.
- Export CSV/JSON/SQL seed data plus README, schema/data dictionary, generator command, fixed seed, source manifest, and validation summary; regenerate twice with the same seed and compare row counts/checksums to demonstrate reproducibility.

## 5. Acceptance-facing UI
- Answers cite effective sources; sensitive cases route correctly; ambiguity triggers clarification; resolution and SLA metrics are reproducible.
- Make realistic distributions, valid joins, dependency/lifecycle consistency, correct derived values, normal/boundary/failure/exception coverage, separate ground truth, fixed-seed reproducibility, documentation, and lawful provenance visible in the workspace.
- If external data is used, record source URL, dataset/version, retrieval date, license/terms, attribution, transformations, and discarded fields. Prefer synthetic data where licensing or suitability is unclear.
