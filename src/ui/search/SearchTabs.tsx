import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import { tTitle } from "i18n";
import { getHomeOwnerName } from "state/home/selectors";
import { getOwnerName } from "state/node/selectors";
import { SearchTab } from "state/search/state";
import { emptySearchFilter } from "state/search/empty";
import { searchLoad, searchOpenFilterDialog } from "state/search/actions";
import { getSearchMode, getSearchNodeName, getSearchQuery, getSearchTab } from "state/search/selectors";
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
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClick = (tab: SearchTab) => () => {
        dispatch(searchLoad(query, tab, emptySearchFilter));
    }

    const onFilterClick = () => dispatch(searchOpenFilterDialog());

    return (
        <div className="search-tabs">
            {TABS.map(tabName => {
                const invisible =
                    tab !== tabName
                    && (
                        (mode === "hashtag" && tabName === "people")
                        || ((ownerName === homeOwnerName || ownerName === searchNodeName) && tabName === "current-blog")
                        || (homeOwnerName == null && tabName === "own-blog")
                    );
                if (invisible) {
                    return null;
                }
                return (
                    <button key={tabName} className={cx("tab", {"active": tabName === tab})} onClick={onClick(tabName)}>
                        {tTitle(t("search-tab." + tabName))}
                    </button>
                );
            })}
            <button className="filter" title={t("filters")} onClick={onFilterClick}>
                <Icon icon={msTune}/>
            </button>
        </div>
    );
}
