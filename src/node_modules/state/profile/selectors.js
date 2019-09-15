import { isPermitted } from "state/node/selectors";

export function isProfileToBeLoaded(state) {
    return !state.profile.loaded && !state.profile.loading;
}

export function isProfileReady(state) {
    return state.profile.loaded && !state.profile.loading;
}

export function isProfileEditing(state) {
    return state.profile.editing;
}

export function isProfileEditable(state) {
    return isProfileReady(state) && isPermitted("edit", state.profile, state);
}
