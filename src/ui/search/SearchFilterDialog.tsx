import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { SearchEntryType } from "api";
import { dispatch } from "state/store-sagas";
import { searchCloseFilterDialog, searchLoad } from "state/search/actions";
import { SearchFilter, SearchMode, SearchTab } from "state/search/state";
import { getSearchFilter, getSearchMode, getSearchQuery, getSearchTab } from "state/search/selectors";
import { Button, ModalDialog } from "ui/control";
import { SelectField, SelectFieldChoice } from "ui/control/field";
import "./SearchFilterDialog.css";

const ENTRY_TYPES: SelectFieldChoice[] = [
    {title: "any", value: "all"},
    {title: "postings", value: "posting"},
    {title: "comments", value: "comment"}
];

type FilterField = "entryType";

const ENABLED_FIELDS: Record<SearchTab, Record<SearchMode, FilterField[]>> = {
    "people": {
        "hashtag": [],
        "fulltext": []
    },
    "content": {
        "hashtag": [],
        "fulltext": []
    },
    "postings": {
        "hashtag": [],
        "fulltext": []
    },
    "comments": {
        "hashtag": [],
        "fulltext": []
    },
    "current-blog": {
        "hashtag": ["entryType"],
        "fulltext": ["entryType"]
    },
    "own-blog": {
        "hashtag": ["entryType"],
        "fulltext": ["entryType"]
    }
}

interface OuterProps {
    tab: SearchTab;
    query: string;
    filter: SearchFilter;
}

interface Values {
    entryType: string;
}

type Props = OuterProps & FormikProps<Values>;

function SearchFilterDialogInner({tab}: Props) {
    const mode = useSelector(getSearchMode);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClose = () => dispatch(searchCloseFilterDialog());

    const enabledFields = ENABLED_FIELDS[tab][mode];

    return (
        <ModalDialog className="search-filter-dialog" title={t("filters")} onClose={onClose}>
            <Form>
                <div className="modal-body">
                    {enabledFields.includes("entryType") &&
                        <SelectField name="entryType" title={t("type-content")} choices={ENTRY_TYPES} horizontal
                                     anyValue/>
                    }
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={onClose}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit">{t("ok")}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const searchFilterDialogLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        entryType: props.filter.entryType
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        const filter: SearchFilter = {
            ...formik.props.filter,
            entryType: values.entryType as SearchEntryType
        }
        dispatch(searchLoad(formik.props.query, formik.props.tab, filter));
        dispatch(searchCloseFilterDialog());
        formik.setSubmitting(false);
    }

};

const SearchFilterDialogOuter = withFormik(searchFilterDialogLogic)(SearchFilterDialogInner);

export default function SearchFilterDialog() {
    const tab = useSelector(getSearchTab);
    const query = useSelector(getSearchQuery);
    const filter = useSelector(getSearchFilter);

    return <SearchFilterDialogOuter tab={tab} query={query} filter={filter}/>;
}
