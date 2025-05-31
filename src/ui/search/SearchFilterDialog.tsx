import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikBag, FormikProps, useFormikContext, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import deepEqual from 'react-fast-compare';

import { SearchEntryType } from "api";
import { ClientState } from "state/state";
import { dispatch } from "state/store-sagas";
import { getSetting } from "state/settings/selectors";
import { searchCloseFilterDialog, searchLoad } from "state/search/actions";
import { emptySearchFilter } from "state/search/empty";
import { SearchFilter, SearchFilterBeforeDate, SearchFilterDatePeriod, SearchTab } from "state/search/state";
import {
    getSafeSearchDefault,
    getSearchFilter,
    getSearchMode,
    getSearchQuery,
    getSearchTab
} from "state/search/selectors";
import { Button, ModalDialog } from "ui/control";
import { CheckboxField, SelectField, SelectFieldChoice, SelectFieldChoiceBase } from "ui/control/field";
import { BooleanString, toBoolean, toBooleanString } from "util/bool-string";
import "./SearchFilterDialog.css";

type FilterField =
    "entryType" | "inNewsfeed" | "ownedByMe" | "repliedToMe" | "minImageCount" | "videoPresent" | "safeSearch"
    | "period";

const ENABLED_FIELDS: Record<SearchTab, FilterField[]> = {
    "people": ["safeSearch"],
    "content": ["ownedByMe", "repliedToMe", "minImageCount", "videoPresent", "safeSearch", "period"],
    "postings": ["ownedByMe", "minImageCount", "videoPresent", "safeSearch", "period"],
    "comments": ["ownedByMe", "repliedToMe", "minImageCount", "videoPresent", "safeSearch", "period"],
    "current-blog": ["entryType", "ownedByMe", "repliedToMe", "minImageCount", "videoPresent", "safeSearch", "period"],
    "own-blog": [
        "entryType", "inNewsfeed", "ownedByMe", "repliedToMe", "minImageCount", "videoPresent", "safeSearch", "period"
    ]
}

const ENTRY_TYPES: SelectFieldChoiceBase<SearchEntryType>[] = [
    {title: "any", value: "all"},
    {title: "postings", value: "posting"},
    {title: "comments", value: "comment"}
];

const WHERE: SelectFieldChoiceBase<BooleanString>[] = [
    {title: "in-blog", value: "false"},
    {title: "in-newsfeed", value: "true"}
];

const AUTHOR: SelectFieldChoiceBase<BooleanString>[] = [
    {title: "anybody", value: "false"},
    {title: "i", value: "true"}
];

const IMAGE_NUMBER: SelectFieldChoice[] = [
    {title: "not-matter", value: "0"},
    {title: "present", value: "1"},
    {title: "several", value: "2"},
    {title: "many", value: "6"}
];

const VIDEO: SelectFieldChoiceBase<BooleanString>[] = [
    {title: "not-matter", value: "false"},
    {title: "present", value: "true"}
];

const BEFORE_DATE: SelectFieldChoiceBase<SearchFilterBeforeDate>[] = [
    {title: "not-matter", value: "now"},
    {title: "yesterday", value: "yesterday"},
    {title: "week-ago", value: "week"},
    {title: "month-ago", value: "month"},
    {title: "three-months-ago", value: "3-months"},
    {title: "year-ago", value: "year"}
];

const DATE_PERIOD: SelectFieldChoiceBase<SearchFilterDatePeriod>[] = [
    {title: "not-matter", value: "any"},
    {title: "today", value: "today"},
    {title: "yesterday", value: "yesterday"},
    {title: "this-week", value: "week"},
    {title: "this-month", value: "month"},
    {title: "last-three-months", value: "3-months"},
    {title: "this-year", value: "year"},
    {title: "more-year", value: "year+"}
];

interface OuterProps {
    tab: SearchTab;
    query: string;
    filter: SearchFilter;
    safeSearchDefault: boolean;
}

interface Values {
    entryType: SearchEntryType;
    inNewsfeed: BooleanString;
    ownedByMe: BooleanString;
    repliedToMe: boolean;
    minImageCount: string;
    videoPresent: BooleanString;
    safeSearch: boolean;
    beforeDate: SearchFilterBeforeDate;
    datePeriod: SearchFilterDatePeriod;
}

type Props = OuterProps & FormikProps<Values>;

function SearchFilterDialogInner({tab, safeSearchDefault}: Props) {
    const mode = useSelector(getSearchMode);
    const sheriffName = useSelector((state: ClientState) => getSetting(state, "search.sheriff-name") as string);
    const {values, setValues} = useFormikContext<Values>();
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClose = () => dispatch(searchCloseFilterDialog());

    const resetDisabled = deepEqual(valuesTofilter(values, safeSearchDefault), emptySearchFilter);

    const onReset = () => setValues(filterToValues(emptySearchFilter, safeSearchDefault));

    const includesComments =
        tab === "content"
        || tab === "comments"
        || ((tab === "own-blog" || tab === "current-blog") && values.entryType !== "posting");

    return (
        <ModalDialog className="search-filter-dialog" title={t("filters")} onClose={onClose}>
            <Form>
                <div className="modal-body">
                    {ENABLED_FIELDS[tab].map(fieldName =>
                        <React.Fragment key={fieldName}>
                            {fieldName === "entryType" &&
                                <SelectField
                                    name="entryType"
                                    title={t("type-content")}
                                    choices={ENTRY_TYPES}
                                    labelClassName="col-4 col-md-3"
                                    horizontal
                                    anyValue
                                />
                            }
                            {fieldName === "inNewsfeed" &&
                                <SelectField
                                    name="inNewsfeed"
                                    title={t("where-look")}
                                    choices={WHERE}
                                    labelClassName="col-4 col-md-3"
                                    horizontal
                                    anyValue
                                />
                            }
                            {fieldName === "ownedByMe" &&
                                <SelectField
                                    name="ownedByMe"
                                    title={t("author")}
                                    choices={AUTHOR}
                                    labelClassName="col-4 col-md-3"
                                    horizontal
                                    anyValue
                                />
                            }
                            {fieldName === "repliedToMe" && includesComments &&
                                <CheckboxField
                                    name="repliedToMe"
                                    title={t("reply-my-comment")}
                                    anyValue
                                />
                            }
                            {fieldName === "minImageCount" &&
                                <SelectField
                                    name="minImageCount"
                                    title={t("images")}
                                    choices={IMAGE_NUMBER}
                                    labelClassName="col-4 col-md-3"
                                    horizontal
                                    anyValue
                                />
                            }
                            {fieldName === "videoPresent" &&
                                <SelectField
                                    name="videoPresent"
                                    title={t("video")}
                                    choices={VIDEO}
                                    labelClassName="col-4 col-md-3"
                                    horizontal
                                    anyValue
                                />
                            }
                            {fieldName === "safeSearch" && sheriffName &&
                                <CheckboxField
                                    name="safeSearch"
                                    title={t("safe-search")}
                                    anyValue
                                />
                            }
                            {fieldName === "period" && mode === "hashtag" &&
                                <SelectField
                                    name="beforeDate"
                                    title={t("date")}
                                    choices={BEFORE_DATE}
                                    labelClassName="col-4 col-md-3"
                                    horizontal
                                    anyValue
                                />
                            }
                            {fieldName === "period" && mode === "fulltext" &&
                                <SelectField
                                    name="datePeriod"
                                    title={t("date")}
                                    choices={DATE_PERIOD}
                                    labelClassName="col-4 col-md-3"
                                    horizontal
                                    anyValue
                                />
                            }
                        </React.Fragment>
                    )}
                </div>
                <div className="modal-footer">
                    <Button variant="outline-secondary" className="me-auto" disabled={resetDisabled} onClick={onReset}>
                        {t("clear-filters")}
                    </Button>
                    <Button variant="secondary" onClick={onClose}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit">{t("ok")}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const filterToValues = (filter: SearchFilter, safeSearchDefault: boolean): Values => ({
    entryType: filter.entryType,
    inNewsfeed: toBooleanString(filter.inNewsfeed),
    ownedByMe: toBooleanString(filter.ownedByMe),
    repliedToMe: filter.repliedToMe,
    minImageCount: (filter.minImageCount ?? 0).toString(),
    videoPresent: toBooleanString(filter.videoPresent),
    safeSearch: filter.safeSearch ?? safeSearchDefault,
    beforeDate: filter.beforeDate,
    datePeriod: filter.datePeriod
});

const valuesTofilter = (values: Values, safeSearchDefault: boolean): SearchFilter => ({
    entryType: values.entryType,
    inNewsfeed: toBoolean(values.inNewsfeed),
    ownedByMe: toBoolean(values.ownedByMe),
    repliedToMe: values.repliedToMe,
    minImageCount: values.minImageCount === "0" ? null : parseInt(values.minImageCount),
    videoPresent: toBoolean(values.videoPresent),
    safeSearch: values.safeSearch === safeSearchDefault ? null : values.safeSearch,
    beforeDate: values.beforeDate,
    datePeriod: values.datePeriod
});

const searchFilterDialogLogic = {

    mapPropsToValues: (props: OuterProps): Values => filterToValues(props.filter, props.safeSearchDefault),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        const filter = valuesTofilter(values, formik.props.safeSearchDefault);
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
    const safeSearchDefault = useSelector(getSafeSearchDefault);

    return <SearchFilterDialogOuter tab={tab} query={query} filter={filter} safeSearchDefault={safeSearchDefault}/>;
}
