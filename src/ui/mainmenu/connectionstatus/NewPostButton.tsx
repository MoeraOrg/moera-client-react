import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isAtComposePage } from "state/navigation/selectors";
import Jump from "ui/navigation/Jump";
import "./NewPostButton.css";

type Props = ConnectedProps<typeof connector>;

const NewPostButton = ({atCompose}: Props) => {
    const {t} = useTranslation();

    return (
        !atCompose ?
            <Jump nodeName=":" href="/compose" className="btn btn-success btn-sm new-post-button">
                <FontAwesomeIcon icon="pen-alt"/>
                &nbsp;&nbsp;{t("new-post-button")}
            </Jump>
            :
            null
    );
}

const connector = connect(
    (state: ClientState) => ({
        atCompose: isAtComposePage(state)
    })
);

export default connector(NewPostButton);
