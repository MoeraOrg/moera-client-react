import { TFunction } from 'i18next';

import { FriendGroupInfo } from "api";
import { getFriendGroupTitle } from "ui/control/principal-display";

export function getPeopleTabTitle(tab: string, friendGroups: FriendGroupInfo[], t: TFunction): string {
    switch (tab) {
        case "subscribers":
            return t("subscribers");
        case "subscriptions":
            return t("subscriptions");
        case "friend-ofs":
            return t("in-friends");
        case "blocked":
            return t("blocked-plural");
        case "blocked-by":
            return t("in-blocked-plural");
        default: {
            const friendGroup = friendGroups.find(fg => fg.id === tab);
            if (friendGroup != null) {
                return getFriendGroupTitle(friendGroup.title, t)
            }
            return "";
        }
    }
}
