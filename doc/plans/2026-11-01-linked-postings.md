# Linked postings implementation plan

> Execution: implement in this checkout using superpowers:executing-plans and test-driven-development.

**Goal:** Flatten received linked postings into the posting cache and show picked copies when originals are unavailable.

**Spec:** The user's request in this session: traverse `linkedPostings` with a queue and a visited set, skip cached
secondary postings, load missing body links after saving all received postings, and record original/picked references.

**Architecture:** Extend the explicit reference-loading helpers used after caching received posts. Reducers strip
`linkedPostings` before storing content. The helpers save secondary posts, then update references and request missing
originals. `LinkedPosting` resolves originals first, then the parent's picked references on the parent's node.

**Tech stack:** TypeScript, React, Redux, existing async sagas, Jest.

## Constraints and decisions

- Preserve the user's pending API changes and the existing action-creator-only convention.
- Work in the supplied checkout; keep the result uncommitted and reviewable.
- Keep reference traversal rooted in retained postings, including picked copies, without pinning every cached post.
- Keep compact/editor previews and the existing preview fallback.
- Process feed and attached-post batches together to avoid loading posts supplied elsewhere in the same batch.
- Use explicit ingestion helpers, as the current design does; avoid recursive effects on `POSTING_SET`.
- No interface copy or API schema changes are needed.

## Review focus

- Cycles, repeated IDs, and an already cached secondary post terminate without replacing cached content.
- A secondary posting can link to a sibling or the primary posting without causing a network request.
- Identical posting IDs on different nodes remain distinct.
- Refreshing a primary posting clears stale references and picked mappings.
- Picked media and gallery access use the primary node, while cached originals retain priority.

## Task 1: Normalize linked posting graphs and references

Files: `src/state/postings/{state,actions,reducer,sagas,references}.ts`,
`src/state/{detailedposting,compose,linkpreviews,imageeditdialog}/sagas.ts`,
`src/state/mediaupload/media-upload.ts`, `tests/state/postings/{linked,cache}.test.ts`.

Interface: add `PickedPostingReference` (`nodeName`, `postingId`, `pickedPostingId`) and
`loadPostingReferencesInPostings(action, postings, nodeName): void`;
extend `postingReferencesSet` with picked references.

- [x] Add regression tests for nested graphs, cycles, cached children, batch siblings, references and refresh.
- [x] Run the focused tests and confirm failures reflect missing graph processing.
- [x] Strip nested data in the reducer; implement a queue, visited/saved sets and the subsequent body-link scan.
- [x] Call the helper at every receiving path that saves `PostingInfo`; update reference collection.
- [x] Run `CI=true npm test -- --watchAll=false --runInBand tests/state/postings` and confirm success.

## Task 2: Display picked fallback postings

Files: `src/state/postings/selectors.ts`, `src/ui/entry/{LinkedPosting,EntryLinkPreviews}.tsx`,
`src/ui/{feed/story/FeedPosting,detailedposting/DetailedPosting,search/SearchEntry}.tsx`,
`tests/ui/entry/LinkedPosting.test.tsx`.

Interface: pass the primary posting ID and node through link previews;
select its picked posting ID by target node/ID.

- [x] Add rendering tests for picked fallback, original priority, missing copies and compact previews.
- [x] Run the tests to confirm the fallback is missing.
- [x] Implement selection and pass the selected posting's node to content, attachments and gallery.
- [x] Run the UI tests, full Jest suite, TypeScript checks and lint for touched files.
- [x] Review the final changes against the request and report verification.

## Progress

- Initial inspection complete. API decoding already supports `linkedPostings` in the user's pending changes.
- Graph tests: five new failures before implementation, then all posting tests passed.
- UI tests: two failures before implementation, then all six rendering tests passed.
- Review found missing remote-media loading for accepted secondary posts. Added a regression with the real media
  helper/reducer, observed the failure, then loaded secondary media after graph caching.
- Full Jest suite: 43 suites, 454 tests passed. Application TypeScript and lint passed.
- Full test TypeScript checking found existing errors in other tests (including story triggers and change-date sagas).
  Focused TypeScript checking of all application code and the three changed/new test files passed after explicit
  callback annotations. The posting tests passed again after these annotations.
- Independent review completed; the remote-media issue was fixed and verified. Existing image-editor node selection
  and preview navigation issues were outside this change. User API changes remain untouched; no commits were made.
