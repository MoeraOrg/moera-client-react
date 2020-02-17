export const POSTING_REPLY = "POSTING_REPLY";
export const postingReply = (id) => ({
    type: POSTING_REPLY,
    payload: {id}
});

export const POSTING_REPLY_FAILED = "POSTING_REPLY_FAILED";
export const postingReplyFailed = () => ({
    type: POSTING_REPLY_FAILED
});
