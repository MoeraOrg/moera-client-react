import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button, ModalDialog } from "ui/control";
import { ClientState } from "state/state";
import { settingsTokensNewTokenClose, settingsTokensNewTokenCopy } from "state/settings/actions";

type Props = ConnectedProps<typeof connector>;

function NewTokenDialog({newToken, settingsTokensNewTokenClose, settingsTokensNewTokenCopy}: Props) {
    if (newToken == null) {
        return null;
    }

    return (
        <ModalDialog title="New Token Created" onClose={settingsTokensNewTokenClose}>
            <div className="modal-body">
                <p>
                    You can now copy your new token. For security reasons, this cannot be done later.
                </p>
                <p className="text-danger">
                    Please note that the token gives full admin access to your blog. Never give it to anybody you don't
                    trust!
                </p>
                <div className="input-group">
                    <input type="text" className="form-control" value={newToken.token} onChange={() => {}}/>
                    <Button variant="secondary" title="Copy" onClick={settingsTokensNewTokenCopy}>
                        <FontAwesomeIcon icon="copy"/>
                    </Button>
                </div>
            </div>
            <div className="modal-footer">
                <Button variant="primary" onClick={settingsTokensNewTokenClose}>Close</Button>
            </div>
        </ModalDialog>
    );
}

const connector = connect(
    (state: ClientState) => ({
        newToken: state.settings.tokens.dialog.newToken
    }),
    { settingsTokensNewTokenClose, settingsTokensNewTokenCopy }
);

export default connector(NewTokenDialog);
