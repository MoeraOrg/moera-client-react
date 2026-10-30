# Bounded Posting Cache Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Preserve useful posts across navigation while bounding unused cached posts.

**Architecture:** Keep cache metadata with `PostingState`, collect state references
once per maintenance, and follow linked-post references stored with each post. Maintenance
is synchronous after a microtask that coalesces requests; eviction only removes
unused entries older than 60 seconds, leaving an unused reserve of 300.

**Tech Stack:** TypeScript, React, Redux, existing triggers/sagas, Jest.

**Spec:** `doc/specs/2026-10-26-postings-cache-design.md`

## Global Constraints

- Use Unix seconds and the existing `now()` helper.
- Follow AGENTS.md quoting/import/action rules; no new dependencies or UI copy.
- Replace linked-post references on refresh and preserve immutable posting objects on metadata updates.
- Work in the supplied checkout; user has authorized implementation of the discussion.

## Review Focus

- Linked-post loading after hydration, cached targets, cross-node IDs, cycles and refreshes.
- Fresh bursts above the limit, exact 60-second boundary, and release grace.
- Node names containing dots, URLs, duplicate IDs on different nodes, relative nodes.
- Pending feed slices, attached media, and visible dialogs beyond the current node.
- No recursive maintenance actions or repeated scans per read; load only uncached linked posts.

### Task 1: Cache metadata and eviction

Files: `src/state/postings/{state,actions,reducer,cache}.ts`,
`tests/state/postings/cache.test.ts`.

- [x] Add failing reducer tests for load timestamps and navigation retention.
- [x] Implement metadata, a pure maintenance reducer, and
  oldest-first eviction of eligible unused entries; cover boundary and immutability cases.
- [x] Run `npm test -- --watchAll=false --runInBand tests/state/postings`.

### Task 2: Reference collection and maintenance scheduling

Files: `src/state/postings/{cache,sagas,triggers}.ts`, corresponding tests.

- [x] Test collection of feed/pending/dialog/media references and unreferenced cycles.
- [x] Implement `getReferencedPostings(state)` and coalesced maintenance through existing sagas/triggers.
- [x] Test maintenance on the ten-minute pulse, wake-up and owner switches, pruning, and release grace.

### Task 3: UI usage and final validation

Files: `src/ui/entry/LinkedPosting.tsx`, `src/state/postings/{reducer,sagas,state}.ts`, corresponding tests.

- [x] Replace UI lifetime tracking with linked-post references derived from link previews.
- [x] Read cached linked postings using a selector and preserve the preview fallback.
- [x] Run full Jest suite, TypeScript, targeted lint and diff checks.
- [x] Measure reference collection/eviction with a large synthetic retained feed.
- [x] Obtain an independent code review and address substantive findings.

### Task 4: Collect references within their owning state branches

- [x] Extract the nine collectors into `src/state/<branch>/references.ts`, each accepting only `ClientState`.
- [x] Aggregate their results, traverse media references and deduplicate them in `postings/cache.ts`.
- [x] Update the maintenance saga, tests, documentation and AGENTS.md reference-maintenance rule.
- [x] Verify the existing cache behavior, node resolution, TypeScript and affected tests.

## Results and implementation decisions

- Hydration tests exposed feed/batch loads writing to the current node instead of
  the payload node. Fixed both paths as required for a cache spanning nodes.
- Link previews populate cached posting references. After hydration, load missing targets;
  cached targets and backlinks reuse existing entries. UI lifetime tracking has been removed.
- Maintenance observes state-reference releases conservatively, so the minimum
  grace period is never shortened. Synchronous maintenance requests are coalesced.
- Maintenance runs after feed changes or owner switches, every ten minutes and on wake-up.
- Reviewer found a lightbox caption lookup mismatch when local and remote media
  IDs coexist. A failing regression reproduced eviction; matching either ID fixes it.
- The 300-entry unused reserve remains a tunable initial choice. Browser scheduling
  was not manually profiled. LinkedPosting retains its preview fallback; missing
  linked postings are loaded after saving the source posting.
- Full Jest suite after replacing UI lifetime tracking: 40 suites, 419 tests passed. TypeScript
  (`tsc --noEmit`), targeted ESLint and `git diff --check` passed.
- Synthetic local steady maintenance before collector extraction, median of 10 warmed
  samples: 1,000 retained + 300 unused postings ~1.8 ms; 10,000 + 300 ~26.4 ms.
  An initial 15,000-entry scan that retained 10,000 and evicted 4,700 took ~102 ms.
  These are local measurements, not browser/mobile latency guarantees.
- The nine reference collectors accept the state snapshot directly. An independent
  review found no missing roots or new runtime import cycles after extraction.
