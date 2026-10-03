import { SharingInfo } from "api";
import {
    closeSharingsDialog, openSharingsDialog, sharingsDialogPastSharingsLoad, sharingsDialogPastSharingsLoaded,
    sharingsDialogPastSharingsLoadFailed
} from "state/sharingsdialog/actions";
import reducer from "state/sharingsdialog/reducer";

const sharing = (id: string, moment: number): SharingInfo => ({
    id, moment, sharingType: "republish", remoteNodeName: "alice", postingId: "post-1", createdAt: 100
});

describe("sharings dialog pagination", () => {
    test("marks the first page as loading and keeps it pending when reopened", () => {
        const opened = reducer(undefined, openSharingsDialog("receiver", "post-1"));
        const loading = reducer(opened, sharingsDialogPastSharingsLoad("receiver", "post-1", Number.MAX_SAFE_INTEGER));

        expect(loading.loading).toBe(true);
        expect(reducer(reducer(loading, closeSharingsDialog()), openSharingsDialog("receiver", "post-1")))
            .toMatchObject({show: true, loading: true});
    });

    test("merges pages in reverse chronological order without duplicate sharings", () => {
        const opened = reducer(undefined, openSharingsDialog("receiver", "post-1"));
        const first = reducer(opened, sharingsDialogPastSharingsLoaded("receiver", "post-1", Number.MAX_SAFE_INTEGER, {
            before: Number.MAX_SAFE_INTEGER, after: 80, total: 3,
            sharings: [sharing("b", 90), sharing("a", 100)]
        }));
        const second = reducer(first, sharingsDialogPastSharingsLoaded("receiver", "post-1", 80, {
            before: 80, after: Number.MIN_SAFE_INTEGER, total: 3,
            sharings: [sharing("b", 90), sharing("c", 70)]
        }));

        expect(second.items.map((item: SharingInfo) => item.id)).toEqual(["a", "b", "c"]);
        expect(second).toMatchObject({loading: false, loaded: true, total: 3, after: Number.MIN_SAFE_INTEGER});
    });

    test("ignores old responses and failures when switching to another node with the same posting ID", () => {
        const opened = reducer(undefined, openSharingsDialog("first", "post-1"));
        const switched = reducer(opened, openSharingsDialog("second", "post-1"));
        const loading = reducer(switched, sharingsDialogPastSharingsLoad("second", "post-1", Number.MAX_SAFE_INTEGER));

        expect(reducer(loading, sharingsDialogPastSharingsLoaded("first", "post-1", Number.MAX_SAFE_INTEGER, {
            before: Number.MAX_SAFE_INTEGER, after: Number.MIN_SAFE_INTEGER, total: 1,
            sharings: [sharing("a", 100)]
        }))).toBe(loading);
        expect(reducer(loading, sharingsDialogPastSharingsLoadFailed("first", "post-1", Number.MAX_SAFE_INTEGER)))
            .toBe(loading);
    });

    test("ignores a repeated old page without moving the cursor backwards", () => {
        const opened = reducer(undefined, openSharingsDialog("receiver", "post-1"));
        const slice = {before: Number.MAX_SAFE_INTEGER, after: 80, total: 2, sharings: [sharing("a", 100)]};
        const first = reducer(opened, sharingsDialogPastSharingsLoaded("receiver", "post-1", Number.MAX_SAFE_INTEGER, slice));
        const loading = reducer(first, sharingsDialogPastSharingsLoad("receiver", "post-1", 80));

        expect(reducer(loading, sharingsDialogPastSharingsLoaded("receiver", "post-1", Number.MAX_SAFE_INTEGER, slice))).toBe(loading);
    });

    test("failed pages can be retried without losing the earlier sharings", () => {
        const opened = reducer(undefined, openSharingsDialog("receiver", "post-1"));
        const first = reducer(opened, sharingsDialogPastSharingsLoaded("receiver", "post-1", Number.MAX_SAFE_INTEGER, {
            before: Number.MAX_SAFE_INTEGER, after: 80, total: 2, sharings: [sharing("a", 100)]
        }));
        const loading = reducer(first, sharingsDialogPastSharingsLoad("receiver", "post-1", 80));
        const failed = reducer(loading, sharingsDialogPastSharingsLoadFailed("receiver", "post-1", 80));

        expect(failed).toMatchObject({loading: false, after: 80});
        expect(failed.items).toEqual(first.items);
    });

    test("records an empty completed page", () => {
        const opened = reducer(undefined, openSharingsDialog("receiver", "post-1"));
        const loaded = reducer(opened, sharingsDialogPastSharingsLoaded("receiver", "post-1", Number.MAX_SAFE_INTEGER, {
            before: Number.MAX_SAFE_INTEGER, after: Number.MIN_SAFE_INTEGER, total: 0, sharings: []
        }));

        expect(loaded).toMatchObject({loaded: true, loading: false, items: [], after: Number.MIN_SAFE_INTEGER});
    });

    test("refreshes the list when reopening after another repost", () => {
        const opened = reducer(undefined, openSharingsDialog("receiver", "post-1"));
        const first = reducer(opened, sharingsDialogPastSharingsLoaded("receiver", "post-1", Number.MAX_SAFE_INTEGER, {
            before: Number.MAX_SAFE_INTEGER, after: Number.MIN_SAFE_INTEGER, total: 1, sharings: [sharing("a", 100)]
        }));
        const reopened = reducer(reducer(first, closeSharingsDialog()), openSharingsDialog("receiver", "post-1"));

        expect(reopened).toMatchObject({show: true, loaded: false, after: Number.MAX_SAFE_INTEGER, items: []});
    });

    test("keeps visible sharings when the total is hidden and the last page is empty", () => {
        const opened = reducer(undefined, openSharingsDialog("receiver", "post-1"));
        const first = reducer(opened, sharingsDialogPastSharingsLoaded("receiver", "post-1", Number.MAX_SAFE_INTEGER, {
            before: Number.MAX_SAFE_INTEGER, after: 80, total: 0, sharings: [sharing("a", 100)]
        }));
        const last = reducer(first, sharingsDialogPastSharingsLoaded("receiver", "post-1", 80, {
            before: 80, after: Number.MIN_SAFE_INTEGER, total: 0, sharings: []
        }));

        expect(last.items.map((item: SharingInfo) => item.id)).toEqual(["a"]);
        expect(last).toMatchObject({loading: false, loaded: true, after: Number.MIN_SAFE_INTEGER});
    });
});
