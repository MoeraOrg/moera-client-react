import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useFormikContext } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { composeDraftSelect } from "state/compose/actions";
import { getComposePostingId, getPostingFeatures } from "state/compose/selectors";
import { getSetting } from "state/settings/selectors";
import composePageLogic, { ComposePageValues } from "ui/compose/compose-page-logic";
import "./ComposeNewPost.css";

function isEmpty(values: ComposePageValues): boolean {
    return composePageLogic.areValuesEmpty(values);
}

type Props = ConnectedProps<typeof connector>;

function ComposeNewPost({postingId, composeDraftSelect}: Props) {
    const {values} = useFormikContext<ComposePageValues>();
    const {t} = useTranslation();

    const onClick = () => composeDraftSelect(null);

    if (postingId != null || isEmpty(values)) {
        return null;
    }
    return (
        <div className="dropdown-item new-post" onClick={onClick}>
            <FontAwesomeIcon icon="pen-alt"/>
            &nbsp;&nbsp;{t("new-post-item")}
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        features: getPostingFeatures(state),
        postingId: getComposePostingId(state),
        posting: state.compose.posting,
        smileysEnabled: getSetting(state, "posting.smileys.enabled") as boolean,
        newsFeedEnabled: getSetting(state, "posting.feed.news.enabled") as boolean,
        avatarShapeDefault: getSetting(state, "avatar.shape.default") as string
    }),
    { composeDraftSelect }
);

export default connector(ComposeNewPost);
