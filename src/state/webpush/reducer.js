import { addDays, getUnixTime } from 'date-fns';

import {
    WEB_PUSH_INVITATION_DECLINED,
    WEB_PUSH_INVITATION_RESTORE,
    WEB_PUSH_SUBSCRIPTION_SET
} from "state/webpush/actions";

const initialState = {
    subscriptionId: null,
    invitationStage: 0,
    invitationTimestamp: 0
};

export default (state = initialState, action) => {
    switch (action.type) {
        case WEB_PUSH_SUBSCRIPTION_SET:
            return {
                ...state,
                subscriptionId: action.payload.id
            };

        case WEB_PUSH_INVITATION_RESTORE:
            return {
                ...state,
                invitationStage: action.payload.stage,
                invitationTimestamp: action.payload.timestamp
            };

        case WEB_PUSH_INVITATION_DECLINED:
            return {
                ...state,
                invitationStage: state.invitationStage + 1,
                invitationTimestamp: getUnixTime(addDays(new Date(), 31))
            };

        default:
            return state;
    }
}
