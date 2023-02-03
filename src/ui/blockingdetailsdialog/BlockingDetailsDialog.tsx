import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { format, fromUnixTime } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { closeBlockingDetailsDialog } from "state/blockingdetailsdialog/actions";
import { NameDisplayMode } from "ui/types";
import { Button, ModalDialog } from "ui/control";
import EntryHtml from "ui/entry/EntryHtml";
import { formatFullName } from "util/misc";

type Props = ConnectedProps<typeof connector>;

function ComposePreviewDialog({
    show, loaded, loading, nodeName, remoteNodeName, by, blocked, nameDisplayMode, closeBlockingDetailsDialog
}: Props) {
    const {t} = useTranslation();

    if (!show) {
        return null;
    }

    const onClose = () => closeBlockingDetailsDialog();

    const name = formatFullName(remoteNodeName, blocked[0]?.contact?.fullName, nameDisplayMode);
    const deadline = blocked[0]?.deadline;
    const reason = blocked[0]?.reason;

    return (
        <ModalDialog title={t(!by ? "details-blocking-name" : "details-blocking-by-name", {name})} loading={loading}
                     onClose={onClose}>
            <div className="modal-body">
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
                        {reason ?
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

const connector = connect(
    (state: ClientState) => ({
        show: state.blockingDetailsDialog.show,
        loaded: state.blockingDetailsDialog.loaded,
        loading: state.blockingDetailsDialog.loading,
        nodeName: state.blockingDetailsDialog.nodeName,
        remoteNodeName: state.blockingDetailsDialog.remoteNodeName,
        by: state.blockingDetailsDialog.by,
        blocked: state.blockingDetailsDialog.blocked,
        nameDisplayMode: getSetting(state, "full-name.display") as NameDisplayMode
    }),
    { closeBlockingDetailsDialog }
);

export default connector(ComposePreviewDialog);
