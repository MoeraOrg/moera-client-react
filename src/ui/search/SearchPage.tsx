import React from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { useIsTinyScreen } from "ui/hook";
import DesktopSearchPage from "ui/search/DesktopSearchPage";
import MobileSearchPage from "ui/search/MobileSearchPage";
import SearchFilterDialog from "ui/search/SearchFilterDialog";
import "./SearchPage.css";

export default function SearchPage() {
    const showFilters = useSelector((state: ClientState) => state.search.showFilters);
    const tinyScreen = useIsTinyScreen();

    return (
        <>
            {!tinyScreen ? <DesktopSearchPage/> : <MobileSearchPage/>}
            {showFilters && <SearchFilterDialog/>}
        </>
    );
}
