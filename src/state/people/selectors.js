export function isPeopleGeneralToBeLoaded(state) {
    return !state.people.loadedGeneral && !state.people.loadingGeneral;
}
