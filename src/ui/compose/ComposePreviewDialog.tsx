import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { composePreviewClose } from "state/compose/actions";
import { Button, ModalDialog } from "ui/control";
import DraftOwner from "ui/draft/DraftOwner";
import DraftSubject from "ui/draft/DraftSubject";
import EntryHtml from "ui/entry/EntryHtml";
import EntryGallery from "ui/entry/EntryGallery";
import { REL_CURRENT } from "util/rel-node-name";
import "./ComposePreviewDialog.css";

export default function ComposePreviewDialog() {
    const draft = useSelector((state: ClientState) => state.compose.draft ?? state.compose.posting);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClose = () => dispatch(composePreviewClose());

    return (
        <ModalDialog className="compose-preview-dialog" size="feed" title={t("post-preview")} onClose={onClose}>
            <div className="modal-body">
                {draft &&
                    <div className="posting entry">
                        <div className="owner-line">
                            <DraftOwner draft={draft}/>
                        </div>
                        <DraftSubject draft={draft}/>
                        <EntryHtml className="content" html={draft.body.text} nodeName={REL_CURRENT}
                                   media={draft.media}/>
                        <EntryGallery nodeName={REL_CURRENT} media={draft.media ?? null}/>
                    </div>
                }
            </div>
            <div className="modal-footer">
                <Button variant="primary" onClick={onClose}>{t("close")}</Button>
            </div>
        </ModalDialog>
    );
}
