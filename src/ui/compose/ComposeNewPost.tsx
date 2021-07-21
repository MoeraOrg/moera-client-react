import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useFormikContext } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { PostingText } from "api/node/api-types";
import composePageLogic, { ComposePageValues, MapToPostingTextProps } from "ui/compose/compose-page-logic";
import { ClientState } from "state/state";
import { composeDraftSelect } from "state/compose/actions";
import { getSetting } from "state/settings/selectors";
import "./ComposeNewPost.css";

function postingText(values: ComposePageValues, props: MapToPostingTextProps): PostingText {
    return composePageLogic.mapValuesToPostingText(values, props);
}

function isEmpty(postingText: PostingText): boolean {
    return composePageLogic.isPostingTextEmpty(postingText);
}

type Props = ConnectedProps<typeof connector>;

function ComposeNewPost(props: Props) {
    const {postingId, composeDraftSelect} = props;
    const {values} = useFormikContext<ComposePageValues>();

    const onClick = () => composeDraftSelect(null);

    if (postingId != null || isEmpty(postingText(values, props))) {
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
        subjectPresent: state.compose.subjectPresent,
        postingId: state.compose.postingId,
        posting: state.compose.posting,
        smileysEnabled: getSetting(state, "posting.smileys.enabled") as boolean,
        newsFeedEnabled: getSetting(state, "posting.feed.news.enabled") as boolean,
        avatarShapeDefault: getSetting(state, "avatar.shape.default") as string
    }),
    { composeDraftSelect }
);

export default connector(ComposeNewPost);
