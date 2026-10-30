# Bounded posting cache

The agreed design keeps postings across node navigation. `PostingState.lastUsedAt`
records loading and changes in state references in Unix seconds, following the existing `now()` helper.
Entries are never evicted less than 60 seconds after that timestamp.

Retain postings referenced by stored feed stories (including pending slices), the
detailed posting, open lightbox and dialogs. Attached media postings and linked
postings needed by retained entries must remain available too.

After loading and saving a post, explicitly scan `posting.body.linkPreviews` using
`parseUniversalPostingUrl` and store the results in `PostingState.references`.
Refreshing a post replaces these references. Load linked postings that are missing
from the cache, checking `isPostingCached` before dispatching `postingLoad`.
Loaders call this explicitly for individual posts and feed slices. Link-preview
generation does not follow the loaded posting's references. Media caption postings
have no link previews and do not need this processing. Saving before
following links ensures a backlink or self-link finds the source post already cached.
LinkedPosting reads cached data with a selector and uses its preview fallback.

Before maintenance, collect references once into sets keyed by node and posting.
Remember whether an entry was referenced at the last maintenance; when its last
state reference disappears, start its grace period then. This is conservative:
release detection can be delayed until maintenance, but cannot shorten protection.
There is no reference scan on selector reads or arbitrary actions.

Each contributing state branch owns a `references.ts` module exporting
`getReferencedPostings(state: ClientState): PostingReference[]`. The cache imports
these collectors under distinct names and combines their results. Postings-specific
linked-post/media traversal and deduplication live in `state/postings/cache.ts`. Relative
node names are resolved from the supplied state, without a separate action context.

Keep up to 300 unused entries (initial implementation choice), evicting the oldest
eligible entries first. Fresh entries can temporarily exceed this soft limit.
Maintenance runs on `FEED_PAST_SLICE_SET`, `FEED_FUTURE_SLICE_SET`,
`FEED_SLICE_UPDATE`, `FEED_UNSET`, `OWNER_SWITCH`, `PULSE_10MIN` and `WAKE_UP`;
coalesce synchronous requests. Remove empty node buckets. Referenced entries are
outside the unused-entry budget; bounding retained feeds is a separate change.

## Approaches

- Keeping current/home nodes plus an LRU for other nodes is smaller, but does not
  describe which individual posts remain necessary.
- The chosen approach protects references and bounds the unused reserve across
  all nodes. A one-minute grace period protects recently loaded entries.
- TTL alone cannot bound a burst of entries and cannot identify posts referenced by state.

Preserve the preview fallback and load missing linked postings after cache hydration.
Add no interface copy. Action creators only construct actions. Work in the
provided checkout and leave the changes reviewable without committing or publishing.
