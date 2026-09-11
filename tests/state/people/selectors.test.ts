import { ClientState } from "state/state";
import {
    getPeopleBlocked,
    getPeopleBlockedBy,
    getPeopleContactsByAlpha,
    getPeopleContactsByDistance,
    getPeopleFriends,
    getPeopleFriendOfs,
    getPeopleSubscribers,
    getPeopleSubscriptions
} from "state/people/selectors";

jest.mock("state/node/selectors", () => ({
    isPermitted: jest.fn()
}));

describe("people contact selectors", () => {
    const contacts = {};
    const state = {people: {contacts}} as ClientState;
    const updatedState = {people: {contacts}} as ClientState;

    test.each([
        ["subscribers", getPeopleSubscribers],
        ["subscriptions", getPeopleSubscriptions],
        ["friends", (currentState: ClientState) => getPeopleFriends(currentState, "group")],
        ["friend-ofs", getPeopleFriendOfs],
        ["blocked", getPeopleBlocked],
        ["blocked-by", getPeopleBlockedBy]
    ])("keeps the %s result stable while contacts do not change", (_name, selector) => {
        expect(selector(state)).toBe(selector(updatedState));
    });

    test("keeps distance sorting independent from alpha sorting", () => {
        const sortingState = {
            people: {
                tab: "subscribers",
                contacts: {
                    close: {contact: {nodeName: "close", fullName: "Zulu", distance: 1}, subscriber: {}},
                    far: {contact: {nodeName: "far", fullName: "Alpha", distance: 2}, subscriber: {}}
                }
            }
        } as unknown as ClientState;

        getPeopleContactsByDistance(sortingState);
        getPeopleContactsByAlpha(sortingState);

        expect(getPeopleContactsByDistance(sortingState).map(contact => contact.contact.nodeName))
            .toStrictEqual(["close", "far"]);
    });
});
