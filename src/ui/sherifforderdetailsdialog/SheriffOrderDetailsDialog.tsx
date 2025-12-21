import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import cx from 'classnames';

import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { closeSheriffOrderDetailsDialog } from "state/sherifforderdetailsdialog/actions";
import { NameDisplayMode } from "ui/types";
import { Button, ModalDialog } from "ui/control";
import Jump from "ui/navigation/Jump";
import { formatFullName } from "util/names";
import { htmlEntities, replaceEmojis } from "util/html";
import { ut } from "util/url";

export default function SheriffOrderDetailsDialog() {
    const loaded = useSelector((state: ClientState) => state.sheriffOrderDetailsDialog.loaded);
    const loading = useSelector((state: ClientState) => state.sheriffOrderDetailsDialog.loading);
    const info = useSelector((state: ClientState) => state.sheriffOrderDetailsDialog.info);
    const nameDisplayMode = useSelector((state: ClientState) =>
        getSetting(state, "full-name.display") as NameDisplayMode);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClose = () => dispatch(closeSheriffOrderDetailsDialog());

    const onOpenComplaint = (_: string, performJump: () => void) => {
        dispatch(closeSheriffOrderDetailsDialog());
        performJump();
    }

    const deleted = info?.delete ?? false;
    const nodeName = formatFullName(info?.nodeName, info?.nodeFullName, nameDisplayMode);
    const postingOwnerName = formatFullName(info?.postingOwnerName, info?.postingOwnerFullName, nameDisplayMode);
    const commentOwnerName = formatFullName(info?.commentOwnerName, info?.commentOwnerFullName, nameDisplayMode);
    const postingHeading = info?.postingHeading != null ? replaceEmojis(htmlEntities(info.postingHeading)) : "";
    const commentHeading = info?.commentHeading != null ? replaceEmojis(htmlEntities(info.commentHeading)) : "";

    let messageKey: string;
    let messageValues;
    const act = !deleted ? "deny" : "allow";
    if (info?.postingId == null) {
        messageKey = `${act}-showing-blog-google-play`;
        messageValues = {name: nodeName};
    } else if (info?.commentId == null) {
        messageKey = `${act}-showing-post-google-play`;
        messageValues = {name: postingOwnerName, heading: postingHeading};
    } else {
        messageKey = `${act}-showing-comment-google-play`;
        messageValues = {
            postingName: postingOwnerName,
            postingHeading: postingHeading,
            commentName: commentOwnerName,
            commentHeading: commentHeading
        };
    }

    return (
        <ModalDialog title={t("sheriff-order")} loading={loading} onClose={onClose}>
            <div className="modal-body">
                {loaded &&
                    <>
                        <p>
                            <Trans i18nKey={messageKey} values={messageValues}>
                                <span className={cx("fw-bold", {"text-danger": !deleted, "text-success": deleted})}/>
                                <b/>
                            </Trans>
                        </p>
                        <p>
                            {info?.complaintGroupId != null ?
                                <Trans i18nKey="decision-upon-complaint">
                                    <Jump nodeName={info.sheriffName} href={ut`/complaints/${info.complaintGroupId}`}
                                          onNear={onOpenComplaint} onFar={onOpenComplaint}/>
                                </Trans>
                            :
                                t("decision-sheriff-initiative")
                            }
                        </p>
                        {!deleted &&
                            <p>
                                <strong>{t("reason")}: </strong>
                                {t(`sheriff-order-reason.${info?.reasonCode ?? "other"}`)}
                            </p>
                        }
                        {info?.reasonDetails &&
                            <p>
                                <strong>{t("comment-title")}:</strong><br/>
                                {replaceEmojis(htmlEntities(info.reasonDetails))}
                            </p>
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
