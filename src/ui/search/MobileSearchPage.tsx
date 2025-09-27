import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { getSearchQuery } from "state/search/selectors";
import { Page } from "ui/page/Page";
import MobileBack from "ui/page/MobileBack";
import BackBox from "ui/page/BackBox";
import BackBoxInner from "ui/page/BackBoxInner";
import { useSearchSuggestions } from "ui/mainmenu/search/search-suggestions";
import SearchInput from "ui/mainmenu/search/SearchInput";
import SearchSuggestions from "ui/mainmenu/search/SearchSuggestions";
import BottomMenu from "ui/mainmenu/BottomMenu";
import { useOverlay } from "ui/overlays/overlays";
import SearchTabs from "ui/search/SearchTabs";
import SearchFeed from "ui/search/SearchFeed";

export default function MobileSearchPage() {
    const searchQuery = useSelector(getSearchQuery);
    const pageRef = useRef(null);
    const [suggestions, setSuggestions] = useState<boolean>(!searchQuery);

    const onSubmit = useCallback(() => setSuggestions(false), [setSuggestions]);

    const {
        query, searchList, selectedIndex, focused, handleKeyDown, handleChange, handleFocus, handleBlur, handleClear,
        handleClick, handleHistoryDelete, inputDom, listDom
    } = useSearchSuggestions({onSubmit});

    useEffect(() => setSuggestions(!searchQuery), [searchQuery]);

    useEffect(() => {
        if (focused) {
            setSuggestions(true);
        }
    }, [focused]);

    useOverlay(
        pageRef,
        {
            visible: !suggestions,
            onClose: () => setSuggestions(true),
            closeOnClick: false,
            closeOnSelect: false,
            closeOnEscape: false
        }
    )

    return (
        <>
            <Page className="search-page tabbed-page">
                <div className="page-central-pane" ref={pageRef}>
                    <MobileBack href="">
                        <div id="search-box">
                            <SearchInput
                                query={query}
                                handleKeyDown={handleKeyDown}
                                handleChange={handleChange}
                                handleFocus={handleFocus}
                                handleBlur={handleBlur}
                                handleClear={handleClear}
                                ref={inputDom}
                            />
                        </div>
                    </MobileBack>
                    <SearchSuggestions
                        query={query}
                        searchList={searchList}
                        selectedIndex={selectedIndex}
                        handleClick={handleClick}
                        onHistoryDelete={handleHistoryDelete}
                        visible={(suggestions || focused) && (searchList.length > 0 || !!query)}
                        ref={listDom}
                    />
                    {!suggestions && !focused &&
                        <>
                            <BackBox>
                                <BackBoxInner>
                                    <SearchTabs/>
                                </BackBoxInner>
                            </BackBox>
                            <SearchFeed/>
                        </>
                    }
                </div>
            </Page>
            <BottomMenu/>
        </>
    );
}
