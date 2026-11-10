import React from 'react';
import { useSelector } from 'react-redux';
import { format, fromUnixTime } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { PostingInfo, PrincipalValue } from "api";
import { tDistanceToNow } from "i18n/time";
import { ClientState } from "state/state";
import { isNodeAdmin, isPermitted } from "state/node/selectors";
import { postingOperationsUpdate } from "state/postings/actions";
import { getSetting } from "state/settings/selectors";
import { storyOperationsUpdate } from "state/stories/actions";
import { useDispatcher } from "ui/hook";
import { MinimalStoryInfo } from "ui/types";
import { Principal, PrincipalSelect } from "ui/control";
import { Icon, msDelete } from "ui/material-symbols";
import { REL_CURRENT } from "util/rel-node-name";
import "./PostingVisibility.css";

interface Props {
    posting: PostingInfo;
    story: MinimalStoryInfo | null;
}

export default function PostingVisibility({posting, story}: Props) {
    const isAdmin = useSelector(isNodeAdmin);
    const postingEditable = useSelector((state: ClientState) =>
        posting.receiverName == null && isPermitted("edit", posting, "owner", state)
    );
    const timeRelative = useSelector((state: ClientState) => getSetting(state, "posting.time.relative") as boolean);
    const dispatch = useDispatcher();
    const {t} = useTranslation();

    const storyViewUnset = story?.operations?.view == null || story.operations.view === "unset";

    const onChange = (value: PrincipalValue) => {
        if (!storyViewUnset) {
            dispatch(storyOperationsUpdate(story.id, REL_CURRENT, {view: value}));
        } else {
            dispatch(postingOperationsUpdate(posting.id, REL_CURRENT, {view: value}));
        }
    };

    const value = (!storyViewUnset ? story?.operations?.view : null)
        ?? posting.receiverOperations?.view ?? posting.operations?.view ?? "public";

    let deletionDate = "";
    if (posting.receiverDeletedAt != null) {
        const date = fromUnixTime(posting.receiverDeletedAt);
        deletionDate = timeRelative
            ? tDistanceToNow(date, t)
            : format(date, "dd-MM-yyyy HH:mm")
    }

    const editable = !storyViewUnset ? isAdmin : postingEditable;

    return (
        <span className="visibility">
            &middot;
            {editable ?
                <PrincipalSelect
                    value={value}
                    values={["public", "signed", "subscribed", "friends", "private"]}
                    onChange={onChange}
                />
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
