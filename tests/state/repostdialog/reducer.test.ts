import {
    closeRepostDialog, openRepostDialog, repostPosting, repostPostingFailed, repostPostingSucceeded
} from "state/repostdialog/actions";
import reducer from "state/repostdialog/reducer";

describe("repost dialog reducer", () => {
    test("opens the dialog for the requested posting", () => {
        const state = reducer(undefined, openRepostDialog("receiver", "Receiver Blog", "post-1", "A post heading", "signed"));

        expect(state).toEqual({
            show: true,
            nodeName: "receiver",
            postingId: "post-1",
            heading: "A post heading",
            fullName: "Receiver Blog",
            visible: "signed",
            submitting: false
        });
    });

    test("closes an open dialog", () => {
        const opened = reducer(undefined, openRepostDialog("receiver", "Receiver Blog", "post-1", "A post heading", "signed"));

        expect(reducer(opened, closeRepostDialog())).toEqual({
            show: false,
            nodeName: "receiver",
            postingId: "post-1",
            heading: "A post heading",
            fullName: "Receiver Blog",
            visible: "signed",
            submitting: false
        });
    });

    test("submission stays open until it succeeds, then closes", () => {
        const opened = reducer(undefined, openRepostDialog("receiver", "Receiver Blog", "post-1", "A post heading", "signed"));

        const submitting = reducer(opened, repostPosting("alice", "post-1", "private"));
        expect(submitting).toMatchObject({show: true, submitting: true});

        expect(reducer(submitting, repostPostingSucceeded())).toMatchObject({show: false, submitting: false});
    });

    test("failed submission leaves the dialog open for another attempt", () => {
        const opened = reducer(undefined, openRepostDialog("receiver", "Receiver Blog", "post-1", "A post heading", "signed"));
        const submitting = reducer(opened, repostPosting("alice", "post-1", "private"));

        expect(reducer(submitting, repostPostingFailed())).toMatchObject({show: true, submitting: false});
    });
});
