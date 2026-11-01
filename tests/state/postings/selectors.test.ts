import { ClientState } from "state/state";
import { getPickedPosting } from "state/postings/selectors";
import { ExtPostingInfo } from "state/postings/state";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";

jest.mock("api", () => ({}));
jest.mock("ui/browser", () => ({}));
jest.mock("i18n", () => ({}));
jest.mock("util/media-images", () => ({}));

const original = {id: "original", body: {text: "Original"}} as ExtPostingInfo;
const homeCopy = {id: "copy", body: {text: "Home copy"}} as ExtPostingInfo;
const alternativeCopy = {id: "copy", body: {text: "Alternative copy"}} as ExtPostingInfo;

describe("picked posting selection", () => {
    let state: ClientState;

    beforeEach(() => {
        state = {
            node: {owner: {name: "alternative.example"}},
            home: {owner: {name: "home.example"}, root: {location: null}},
            settings: {client: {meta: new Map(), values: new Map()}},
            postings: {
                "original.example": {original: {picked: [
                    {nodeName: "alternative.example", postingId: "copy"},
                    {nodeName: "home.example", postingId: "copy"}
                ]}},
                "home.example": {copy: {posting: homeCopy}},
                "alternative.example": {copy: {posting: alternativeCopy}}
            }
        } as unknown as ClientState;
    });

    test.each(["home.example", null])("prefers the original when the home owner is %s", homeOwnerName => {
        state.home.owner.name = homeOwnerName;
        state.postings["original.example"]!.original!.posting = original;

        expect(getPickedPosting(state, "original", "original.example", REL_CURRENT))
            .toEqual({posting: original, nodeName: "original.example"});
    });

    test("prefers a home copy even when an alternative copy is listed first", () => {
        expect(getPickedPosting(state, "original", "original.example", REL_CURRENT))
            .toEqual({posting: homeCopy, nodeName: "home.example"});
        expect(getPickedPosting(state, "original", "original.example"))
            .toEqual({posting: homeCopy, nodeName: "home.example"});
    });

    test.each(["missing", "metadata only"])("uses an alternative when the home copy is %s", missing => {
        state.postings["home.example"]!.copy = missing === "missing" ? undefined : {visitRecorded: true};

        expect(getPickedPosting(state, "original", "original.example", "alternative.example"))
            .toEqual({posting: alternativeCopy, nodeName: "alternative.example"});
    });

    test("resolves relative node names for the original and alternative", () => {
        state.home.owner.name = "original.example";

        expect(getPickedPosting(state, "original", REL_HOME, REL_CURRENT))
            .toEqual({posting: alternativeCopy, nodeName: "alternative.example"});

        state.postings["original.example"]!.original!.posting = original;
        expect(getPickedPosting(state, "original", REL_HOME, REL_CURRENT))
            .toEqual({posting: original, nodeName: "original.example"});
    });

    test("uses an alternative without a home owner", () => {
        state.home.owner.name = null;

        expect(getPickedPosting(state, "original", "original.example", REL_CURRENT))
            .toEqual({posting: alternativeCopy, nodeName: "alternative.example"});
    });

    test.each([undefined, "unrelated.example"])("does not select unrelated copies with alternative %s", alternative => {
        state.home.owner.name = null;

        expect(getPickedPosting(state, "original", "original.example", alternative)).toBeNull();
    });

    test("skips missing and metadata-only copies on the same node", () => {
        state.postings["home.example"]!.metadata = {visitRecorded: true};
        state.postings["original.example"]!.original!.picked!.unshift(
            {nodeName: "home.example", postingId: "missing"},
            {nodeName: "home.example", postingId: "metadata"}
        );

        expect(getPickedPosting(state, "original", "original.example", REL_CURRENT))
            .toEqual({posting: homeCopy, nodeName: "home.example"});
    });

    test("returns null when neither preferred node has a cached copy", () => {
        state.postings["home.example"] = {};
        state.postings["alternative.example"]!.copy = {visitRecorded: true};

        expect(getPickedPosting(state, "original", "original.example", REL_CURRENT)).toBeNull();
    });

    test("returns null without an original entry or picked references", () => {
        expect(getPickedPosting(state, "missing", "original.example", REL_CURRENT)).toBeNull();
        state.postings["original.example"]!.original = {visitRecorded: true};
        expect(getPickedPosting(state, "original", "original.example", REL_CURRENT)).toBeNull();
    });
});
