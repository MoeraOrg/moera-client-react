import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { searchScrolled } from "state/search/actions";
import { getSearchTab, hasSearchMoreResults } from "state/search/selectors";
import { FeedTopBox, Loading } from "ui/control";
import { useDebounce } from "ui/hook";
import { Icon, msArrowUpward } from "ui/material-symbols";
import { Page } from "ui/page/Page";
import BackBox from "ui/page/BackBox";
import MobileMainMenu from "ui/mainmenu/MobileMainMenu";
import MainMenuSidebar from "ui/mainmenu/MainMenuSidebar";
import BottomMenu from "ui/mainmenu/BottomMenu";
import SearchTabs from "ui/search/SearchTabs";
import SearchNode from "ui/search/SearchNode";
import SearchEntry from "ui/search/SearchEntry";
import SearchShowMore from "ui/search/SearchShowMore";
import NothingFound from "ui/search/NothingFound";
import SearchFilterDialog from "ui/search/SearchFilterDialog";
import "./SearchPage.css";
import BackBoxInner from "ui/page/BackBoxInner";

export default function SearchPage() {
    const tab = useSelector(getSearchTab);
    const entries = useSelector((state: ClientState) => state.search.entries);
    const nodes = useSelector((state: ClientState) => state.search.nodes);
    const loading = useSelector((state: ClientState) => state.search.loading);
    const loaded = useSelector((state: ClientState) => state.search.loaded);
    const moreResults = useSelector(hasSearchMoreResults);
    const showFilters = useSelector((state: ClientState) => state.search.showFilters);
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

    const onTop = () => {
        window.scrollTo(0, 0);
    }

    const hasContent = loaded && (tab === "people" ? nodes.length > 0 : entries.length > 0);

    return (
        <>
            <MobileMainMenu shadow/>
            <Page className="search-page tabbed-page">
                <div className="page-left-pane">
                    <MainMenuSidebar/>
                </div>
                <div className="page-central-pane">
                    <BackBox>
                        <BackBoxInner>
                            <SearchTabs/>
                        </BackBoxInner>
                    </BackBox>
                    <FeedTopBox>
                        {scrollPosition > 50 &&
                            <div className="feed-top-button" onClick={onTop}>
                                <Icon icon={msArrowUpward} size={16}/><span className="title">{t("top")}</span>
                            </div>
                        }
                    </FeedTopBox>
                    {hasContent ?
                        <>
                            {tab === "people" ?
                                <div className="content-panel nodes">
                                    {nodes.map((node, index) =>
                                        <SearchNode node={node} key={index}/>
                                    )}
                                    {moreResults && <SearchShowMore loading={loading}/>}
                                </div>
                            :
                                <>
                                    {entries.map(entry =>
                                        <SearchEntry entry={entry} key={entry.moment}/>
                                    )}
                                    {moreResults && <SearchShowMore loading={loading}/>}
                                </>
                            }
                        </>
                    :
                        <div className="content-panel text-center">
                            {loading ? <Loading/> : <NothingFound/>}
                        </div>
                    }
                </div>
                {showFilters && <SearchFilterDialog/>}
            </Page>
            <BottomMenu/>
        </>
    );
}
