import { useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import deepEqual from 'react-fast-compare';

import { tTitle } from "i18n";
import { ClientState } from "state/state";
import { getHomeOwnerName } from "state/home/selectors";
import { getOwnerName } from "state/node/selectors";
import { SearchTab } from "state/search/state";
import { emptySearchFilter } from "state/search/empty";
import { searchLoad, searchOpenFilterDialog } from "state/search/actions";
import {
    getSearchFilter,
    getSearchMode,
    getSearchNodeName,
    getSearchQuery,
    getSearchTab
} from "state/search/selectors";
import { UnderlinedTabDescription, UnderlinedTabs } from "ui/control";
import { Icon, msTune } from "ui/material-symbols";
import "./SearchTabs.css";

const TABS: SearchTab[] = ["people", "content", "postings", "comments", "current-blog", "own-blog"];

export default function SearchTabs() {
    const ownerName = useSelector(getOwnerName);
    const homeOwnerName = useSelector(getHomeOwnerName);
    const searchNodeName = useSelector(getSearchNodeName);
    const mode = useSelector(getSearchMode);
    const query = useSelector(getSearchQuery);
    const tab = useSelector(getSearchTab);
    const {t} = useTranslation();
    const tabs = useMemo<UnderlinedTabDescription[]>(
        () => TABS.map(tabName => {
            const invisible =
                tab !== tabName
                && (
                    (mode === "hashtag" && tabName === "people")
                    || (
                        (ownerName === homeOwnerName || ownerName === searchNodeName)
                        && tabName === "current-blog"
                    )
                    || (homeOwnerName == null && tabName === "own-blog")
                );
            return {
                title: tTitle(t("search-tab." + tabName)),
                value: tabName,
                visible: !invisible
            };
        }),
        [homeOwnerName, mode, ownerName, searchNodeName, t, tab]
    );
    const filterActive = useSelector((state: ClientState) => !deepEqual(getSearchFilter(state), emptySearchFilter));
    const dispatch = useDispatch();

    const onClick = (tab: SearchTab) => dispatch(searchLoad(query, tab, emptySearchFilter));

    const onFilterClick = () => dispatch(searchOpenFilterDialog());

    return (
        <UnderlinedTabs tabs={tabs} value={tab} onChange={onClick} className="search-tabs">
            <button className="filter" title={t("filters")} onClick={onFilterClick}>
                {filterActive && <div className="indicator"/>}
                <Icon icon={msTune}/>
            </button>
        </UnderlinedTabs>
    )
}
