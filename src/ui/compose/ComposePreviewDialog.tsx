import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Button, ModalDialog } from "ui/control";
import { ClientState } from "state/state";
import { composePreviewClose } from "state/compose/actions";
import { getFeedWidth } from "state/settings/selectors";
import DraftOwner from "ui/draft/DraftOwner";
import DraftSubject from "ui/draft/DraftSubject";
import EntryHtml from "ui/entry/EntryHtml";
import EntryGallery from "ui/entry/EntryGallery";
import "./ComposePreviewDialog.css";

type Props = ConnectedProps<typeof connector>;

function ComposePreviewDialog({draft, feedWidth, composePreviewClose}: Props) {
    const {t} = useTranslation();

    const onClose = () => composePreviewClose();

    return (
        <ModalDialog className="compose-preview-dialog" style={{"--feed-width": feedWidth + "px"}}
                     title={t("post-preview")} onClose={onClose}>
            <div className="modal-body">
                {draft &&
                    <div className="posting entry">
                        <div className="owner-line">
                            <DraftOwner draft={draft}/>
                        </div>
                        <DraftSubject draft={draft}/>
                        <EntryHtml className="content" html={draft.body.text} nodeName="" media={draft.media}/>
                        <EntryGallery nodeName="" media={draft.media ?? null}/>
                    </div>
                }
            </div>
            <div className="modal-footer">
                <Button variant="primary" onClick={onClose}>{t("close")}</Button>
            </div>
        </ModalDialog>
    );
}

const connector = connect(
    (state: ClientState) => ({
        draft: state.compose.draft ?? state.compose.posting,
        feedWidth: getFeedWidth(state)
    }),
    { composePreviewClose }
);

export default connector(ComposePreviewDialog);
