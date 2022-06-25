import React from 'react';
import cx from 'classnames';

import { PrincipalValue } from "api/node/api-types";
import { PeopleTab } from "state/people/state";
import { Principal } from "ui/control";

interface Props {
    name: PeopleTab;
    title: string;
    principal?: PrincipalValue | null;
    total: number;
    loaded: boolean;
    active: string;
    peopleGoToTab: (tab: PeopleTab) => void;
}

const PeopleTabsItem = ({name, title, principal, total, loaded, active, peopleGoToTab}: Props) => (
    <div className={cx("tab", {"active": name === active})} onClick={() => peopleGoToTab(name)}>
        {title}{loaded ? ` (${total})` : ""}
        {(principal && principal !== "public") &&
            <Principal value={principal} icons={{"admin": "lock"}}/>
        }
    </div>
);

export default PeopleTabsItem;
