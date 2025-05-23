import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { searchScrolled } from "state/search/actions";
import { getSearchQuery, getSearchTab, hasSearchMoreResults } from "state/search/selectors";
import { Loading } from "ui/control";
import { useDebounce } from "ui/hook";
import { useIsTinyScreen } from "ui/hook/media-query";
import PageHeader from "ui/page/PageHeader";
import { Page } from "ui/page/Page";
import SearchTabs from "ui/search/SearchTabs";
import SearchNode from "ui/search/SearchNode";
import SearchEntry from "ui/search/SearchEntry";
import SearchShowMore from "ui/search/SearchShowMore";
import NothingFound from "ui/search/NothingFound";
import { ellipsize } from "util/text";
import "./SearchPage.css";

export default function SearchPage() {
    const query = useSelector(getSearchQuery);
    const tab = useSelector(getSearchTab);
    const entries = useSelector((state: ClientState) => state.search.entries);
    const nodes = useSelector((state: ClientState) => state.search.nodes);
    const loading = useSelector((state: ClientState) => state.search.loading);
    const loaded = useSelector((state: ClientState) => state.search.loaded);
    const moreResults = useSelector(hasSearchMoreResults);
    const tinyScreen = useIsTinyScreen();
    const [scrollPosition, setScrollPosition] = useDebounce(0, 250);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    useEffect(() => {
        dispatch(searchScrolled(scrollPosition))
    }, [dispatch, scrollPosition]);

    const onScroll = useCallback(() => setScrollPosition(window.scrollY), [setScrollPosition]);

    useEffect(() => {
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [dispatch, onScroll]);

    const hasContent = loaded && (tab === "people" ? nodes.length > 0 : entries.length > 0);

    return (
        <>
            <PageHeader>
                <h2>{t("search")}{query ? ": " + ellipsize(query, tinyScreen ? 16 : 40) : ""}</h2>
            </PageHeader>
            <Page className="search-page">
                <SearchTabs/>
                {hasContent ?
                    <>
                        {tab === "people" ?
                            <div className="content-panel nodes">
                                {nodes.map((node, index) =>
                                    <SearchNode node={node} key={index}/>
                                )}
                            </div>
                        :
                            entries.map(entry =>
                                <SearchEntry entry={entry} key={entry.moment}/>
                            )
                        }
                        {moreResults && <SearchShowMore loading={loading}/>}
                    </>
                :
                    <div className="content-panel text-center">
                        {loading ? <Loading/> : <NothingFound/>}
                    </div>
                }
            </Page>
        </>
    );
}
