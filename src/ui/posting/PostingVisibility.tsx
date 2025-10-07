import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format, fromUnixTime } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { PostingInfo, PrincipalValue } from "api";
import { tDistanceToNow } from "i18n/time";
import { ClientState } from "state/state";
import { postingOperationsUpdate } from "state/postings/actions";
import { getSetting } from "state/settings/selectors";
import { Principal, PrincipalSelect } from "ui/control";
import { Icon, msDelete } from "ui/material-symbols";
import { REL_CURRENT } from "util/rel-node-name";
import "./PostingVisibility.css";

interface Props {
    posting: PostingInfo;
    editable: boolean;
}

export default function PostingVisibility({posting, editable}: Props) {
    const timeRelative = useSelector((state: ClientState) => getSetting(state, "posting.time.relative") as boolean);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onChange = (value: PrincipalValue) =>
        dispatch(postingOperationsUpdate(posting.id, REL_CURRENT, {view: value}));

    const value = posting.receiverOperations?.view ?? posting.operations?.view ?? "public";
    let deletionDate = "";
    if (posting.receiverDeletedAt != null) {
        const date = fromUnixTime(posting.receiverDeletedAt);
        deletionDate = timeRelative
            ? tDistanceToNow(date, t)
            : format(date, "dd-MM-yyyy HH:mm")
    }

    return (
        <span className="visibility">
            &middot;
            {editable ?
                <PrincipalSelect value={value} values={["public", "signed", "subscribed", "friends", "private"]}
                                 onChange={onChange}/>
            :
                (posting.receiverDeletedAt == null ?
                    <Principal value={value}/>
                :
                    <span className="principal text-danger opacity-75"
                          title={t("original-deleted", {date: deletionDate})}>
                        <Icon icon={msDelete} size="1em"/>
                    </span>
                )
            }
        </span>
    );
}
