import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format, fromUnixTime } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { closeBlockingDetailsDialog } from "state/blockingdetailsdialog/actions";
import { NameDisplayMode } from "ui/types";
import { Button, ModalDialog } from "ui/control";
import EntryHtml from "ui/entry/EntryHtml";
import Jump from "ui/navigation/Jump";
import { formatFullName } from "util/names";
import { htmlEntities, replaceEmojis } from "util/html";

export default function BlockingDetailsDialog() {
    const loaded = useSelector((state: ClientState) => state.blockingDetailsDialog.loaded);
    const loading = useSelector((state: ClientState) => state.blockingDetailsDialog.loading);
    const nodeName = useSelector((state: ClientState) => state.blockingDetailsDialog.nodeName);
    const remoteNodeName = useSelector((state: ClientState) => state.blockingDetailsDialog.remoteNodeName);
    const remotePostingId = useSelector((state: ClientState) => state.blockingDetailsDialog.remotePostingId);
    const remotePostingHeading = useSelector((state: ClientState) => state.blockingDetailsDialog.remotePostingHeading);
    const by = useSelector((state: ClientState) => state.blockingDetailsDialog.by);
    const blocked = useSelector((state: ClientState) => state.blockingDetailsDialog.blocked);
    const nameDisplayMode = useSelector(
        (state: ClientState) => getSetting(state, "full-name.display") as NameDisplayMode
    );
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClose = () => dispatch(closeBlockingDetailsDialog());

    const name = formatFullName(remoteNodeName, blocked[0]?.contact?.fullName, nameDisplayMode);
    const deadline = blocked[0]?.deadline;
    const reason = blocked[0]?.reason;
    const headingHtml = remotePostingHeading != null ? replaceEmojis(htmlEntities(remotePostingHeading)) : "";

    return (
        <ModalDialog title={t(!by ? "details-blocking-name" : "details-blocking-by-name", {name})} loading={loading}
                     onClose={onClose}>
            <div className="modal-body">
                {(remoteNodeName != null && remotePostingId != null) &&
                    <p>
                        <strong>{t("in-post")}: </strong>
                        <Jump nodeName={remoteNodeName} href={`/post/${remotePostingId}`}>
                            <span dangerouslySetInnerHTML={{__html: headingHtml}}/>
                        </Jump>
                    </p>
                }
                {loaded && blocked.length === 0 ?
                    <p>
                        <strong>{t("no-blocking")}</strong>
                    </p>
                :
                    <>
                        <p>
                            <strong>{t("prohibited")}: </strong>
                            {blocked.map(bu => t(`prohibited-to-${bu.blockedOperation}`)).join(", ")}
                            {deadline &&
                                <>
                                    <br/>
                                    <strong>{t("blocking-till")}: </strong>
                                    {format(fromUnixTime(deadline), "dd-MM-yyyy HH:mm")}
                                </>
                            }
                        </p>
                        <strong>{t("blocking-reason")}:</strong>
                        <br/>
                        {(reason && nodeName != null) ?
                            <EntryHtml html={reason} nodeName={nodeName}/>
                        :
                            <p>{t("not-specified")}</p>
                        }
                    </>
                }
            </div>
            <div className="modal-footer">
                <Button variant="primary" onClick={onClose}>{t("close")}</Button>
            </div>
        </ModalDialog>
    );
}
