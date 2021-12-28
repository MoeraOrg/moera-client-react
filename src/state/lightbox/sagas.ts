import { put, select } from 'typed-redux-saga/macro';

import { getLightBoxMediaPostingId } from "state/lightbox/selectors";
import { postingLoad } from "state/postings/actions";
import { executor } from "state/executor";
import { LIGHT_BOX_MEDIA_POSTING_LOAD } from "state/lightbox/actions";

export default [
    executor(LIGHT_BOX_MEDIA_POSTING_LOAD, null, lightBoxMediaPostingLoadSaga)
];

function* lightBoxMediaPostingLoadSaga() {
    const postingId = yield* select(getLightBoxMediaPostingId);
    if (postingId != null) {
        yield* put(postingLoad(postingId));
    }
}
