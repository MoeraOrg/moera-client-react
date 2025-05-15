import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getSearchQuery } from "state/search/selectors";
import { Loading } from "ui/control";
import PageHeader from "ui/page/PageHeader";
import { Page } from "ui/page/Page";
import SearchEntry from "ui/search/SearchEntry";
import NothingFound from "ui/search/NothingFound";

export default function SearchPage() {
    const query = useSelector(getSearchQuery);
    const entries = useSelector((state: ClientState) => state.search.entries);
    const loading = useSelector((state: ClientState) => state.search.loading);
    const loaded = useSelector((state: ClientState) => state.search.loaded);
    const {t} = useTranslation();

    return (
        <>
            <PageHeader>
                <h2>{t("search")}{query ? ": " + query : ""}</h2>
            </PageHeader>
            <Page>
                {loaded && entries.length > 0 ?
                    entries.map(entry =>
                        <SearchEntry entry={entry} key={entry.moment}/>
                    )
                :
                    <div className="content-panel text-center">
                        {loading ? <Loading/> : <NothingFound/>}
                    </div>
                }
            </Page>
        </>
    );
}
