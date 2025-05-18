import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import { tTitle } from "i18n";
import { isConnectedToHome } from "state/home/selectors";
import { SearchTab } from "state/search/state";
import { searchLoad } from "state/search/actions";
import { getSearchMode, getSearchQuery, getSearchTab } from "state/search/selectors";
import "./SearchTabs.css";

const TABS: SearchTab[] = ["people", "content", "postings", "comments", "own-blog"];

export default function SearchTabs() {
    const connectedToHome = useSelector(isConnectedToHome);
    const mode = useSelector(getSearchMode);
    const query = useSelector(getSearchQuery);
    const tab = useSelector(getSearchTab);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClick = (tab: SearchTab) => () => {
        dispatch(searchLoad(query, tab));
    }

    return (
        <div className="search-tabs">
            {TABS.map(tabName => {
                const invisible =
                    tab !== tabName
                    && (
                        (mode === "hashtag" && tabName === "people")
                        || (!connectedToHome && tabName === "own-blog")
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
        </div>
    );
}
