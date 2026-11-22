import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import deepEqual from 'react-fast-compare';

import { ClientState } from "state/state";
import { ExtPostingInfo } from "state/postings/state";
import { postingVisited } from "state/postings/actions";
import { getPickedPosting } from "state/postings/selectors";
import { useDispatcher } from "ui/hook";
import { RelNodeName } from "util/rel-node-name";
import { parseUniversalPostingUrl } from "util/universal-url";
import { notNull } from "util/misc";

export function usePostingVisited(nodeName: string | RelNodeName, posting: ExtPostingInfo | null | undefined) {
    const linkedPostings = useSelector((state: ClientState) =>
        (posting?.body.linkPreviews ?? [])
            .map(preview => parseUniversalPostingUrl(preview.url))
            .filter(notNull)
            .map(r => getPickedPosting(state, r.postingId, r.nodeName, nodeName))
            .filter(notNull)
            .map(p => ({
                nodeName: p.nodeName,
                id: p.posting.id,
                receiverName: p.posting.receiverName,
                receiverPostingId: p.posting.receiverPostingId
            })),
        deepEqual
    );
    const dispatch = useDispatcher();

    const {id, receiverName, receiverPostingId} = posting ?? {id: ""};
    useEffect(() => {
        if (receiverName != null && receiverPostingId != null) {
            dispatch(postingVisited(receiverPostingId, receiverName));
        } else if (id) {
            dispatch(postingVisited(id, nodeName));
        }
    }, [dispatch, nodeName, id, receiverName, receiverPostingId]);

    useEffect(() => {
        for (const linkedPosting of linkedPostings) {
            const {nodeName: lNodeName, id, receiverName, receiverPostingId} = linkedPosting;
            if (receiverName != null && receiverPostingId != null) {
                dispatch(postingVisited(receiverPostingId, receiverName));
            } else if (id) {
                dispatch(postingVisited(id, lNodeName));
            }
        }
    }, [dispatch, nodeName, linkedPostings, id, receiverName, receiverPostingId]);
}
