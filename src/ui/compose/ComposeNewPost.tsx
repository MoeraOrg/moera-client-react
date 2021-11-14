import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useFormikContext } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ClientState } from "state/state";
import { composeDraftSelect } from "state/compose/actions";
import { getSetting } from "state/settings/selectors";
import composePageLogic, { ComposePageValues } from "ui/compose/compose-page-logic";
import "./ComposeNewPost.css";

function isEmpty(values: ComposePageValues): boolean {
    return composePageLogic.areValuesEmpty(values);
}

type Props = ConnectedProps<typeof connector>;

function ComposeNewPost({postingId, composeDraftSelect}: Props) {
    const {values} = useFormikContext<ComposePageValues>();

    const onClick = () => composeDraftSelect(null);

    if (postingId != null || isEmpty(values)) {
        return null;
    }
    return (
        <div className="dropdown-item new-post" onClick={onClick}>
            <FontAwesomeIcon icon="pen-alt"/>
            &nbsp;&nbsp;New post
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        features: state.compose.features,
        postingId: state.compose.postingId,
        posting: state.compose.posting,
        smileysEnabled: getSetting(state, "posting.smileys.enabled") as boolean,
        newsFeedEnabled: getSetting(state, "posting.feed.news.enabled") as boolean,
        avatarShapeDefault: getSetting(state, "avatar.shape.default") as string
    }),
    { composeDraftSelect }
);

export default connector(ComposeNewPost);
