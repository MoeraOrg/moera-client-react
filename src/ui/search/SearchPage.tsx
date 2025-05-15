import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getSearchQuery } from "state/search/selectors";
import PageHeader from "ui/page/PageHeader";
import { Page } from "ui/page/Page";
import SearchEntry from "ui/search/SearchEntry";

export default function SearchPage() {
    const query = useSelector(getSearchQuery);
    const entries = useSelector((state: ClientState) => state.search.entries);
    const {t} = useTranslation();

    return (
        <>
            <PageHeader>
                <h2>{t("search")}{query ? ": " + query : ""}</h2>
            </PageHeader>
            <Page>
                {entries.map(entry =>
                    <SearchEntry entry={entry} key={entry.moment}/>
                )}
            </Page>
        </>
    );
}
