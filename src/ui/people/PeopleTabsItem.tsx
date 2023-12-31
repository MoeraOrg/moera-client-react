import React from 'react';
import cx from 'classnames';
import { faLock } from '@fortawesome/free-solid-svg-icons';

import { PrincipalValue } from "api";
import { PeopleTab } from "state/people/state";
import { Principal } from "ui/control";

interface Props {
    name: PeopleTab;
    title: string;
    principal?: PrincipalValue | null;
    principalTitles?: Partial<Record<PrincipalValue, string>> | null;
    total: number;
    loaded: boolean;
    active: string;
    peopleGoToTab: (tab: PeopleTab) => void;
}

const PeopleTabsItem = ({name, title, principal, principalTitles, total, loaded, active, peopleGoToTab}: Props) => (
    <li className="nav-item">
        <span className={cx("nav-link", {"active": name === active})} onClick={() => peopleGoToTab(name)}>
            <span className="title">
                {title}
                {principal &&
                    <>{" "}<Principal value={principal} defaultValue="public" icons={{"admin": faLock}}
                                      titles={principalTitles}/></>
                }
            </span>
            {loaded && <span className="badge">{total}</span>}
        </span>
    </li>
);

export default PeopleTabsItem;
