import { addHours, getUnixTime } from 'date-fns';
import * as immutable from 'object-path-immutable';

import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import { RemoteMediaState, RemoteMediaStatus } from "state/remotemedia/state";

const initialState: RemoteMediaState = {
};

const emptyRemoteMedia: RemoteMediaStatus = {
    loading: false,
    loaded: false,
    error: false,
    media: null
};

export default (state: RemoteMediaState = initialState, action: WithContext<ClientAction>): RemoteMediaState => {
    switch (action.type) {
        case "REMOTE_MEDIA_LOAD": {
            const {nodeName, mediaId} = action.payload;
            return immutable.set(state, [nodeName, mediaId], {
                ...emptyRemoteMedia,
                media: state[nodeName]?.[mediaId]?.media ?? null,
                loading: true
            });
        }

        case "REMOTE_MEDIA_LOADED":
            return immutable.assign(state, [action.payload.nodeName, action.payload.mediaId], {
                loading: false,
                loaded: true,
                error: false,
                media: action.payload.media
            });

        case "REMOTE_MEDIA_LOAD_FAILED":
            return immutable.set(state, [action.payload.nodeName, action.payload.mediaId], {
                ...emptyRemoteMedia,
                loaded: true,
                error: true
            });

        case "REMOTE_MEDIA_MAINTENANCE": {
            const expiresBefore = getUnixTime(addHours(new Date(), 2));
            const istate = immutable.wrap(state);
            for (const [nodeName, node] of Object.entries(state)) {
                if (node == null) {
                    continue;
                }
                for (const [mediaId, remoteMedia] of Object.entries(node)) {
                    const grantExpiresAt = remoteMedia?.media?.grantExpiresAt;
                    if (remoteMedia?.loaded && grantExpiresAt != null && grantExpiresAt <= expiresBefore) {
                        istate.del([nodeName, mediaId]);
                    }
                }
            }
            return istate.value();
        }

        case "REMOTE_MEDIA_POPULATE": {
            const istate = immutable.wrap(state);
            for (const [nodeName, node] of Object.entries(action.payload.remoteMedia)) {
                if (node == null) {
                    continue;
                }
                for (const [mediaId, media] of Object.entries(node)) {
                    if (media == null || state[nodeName]?.[mediaId] != null) {
                        continue;
                    }
                    istate.set([nodeName, mediaId], {
                        ...emptyRemoteMedia,
                        loaded: true,
                        media
                    });
                }
            }
            return istate.value();
        }

        default:
            return state;
    }
};
