import { put, select } from 'typed-redux-saga/macro';

import { getLightBoxMediaPostingId, getLightBoxNodeName } from "state/lightbox/selectors";
import { postingLoad } from "state/postings/actions";
import { executor } from "state/executor";
import { LIGHT_BOX_MEDIA_POSTING_LOAD } from "state/lightbox/actions";
import { ClientState } from "state/state";

export default [
    executor(LIGHT_BOX_MEDIA_POSTING_LOAD, null, lightBoxMediaPostingLoadSaga)
];

function* lightBoxMediaPostingLoadSaga() {
    const {nodeName, postingId} = yield* select((state: ClientState) => ({
        nodeName: getLightBoxNodeName(state),
        postingId: getLightBoxMediaPostingId(state)
    }));
    if (postingId != null) {
        yield* put(postingLoad(postingId, nodeName));
    }
}
