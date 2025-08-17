import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isAtHomeNode } from "state/node/selectors";
import { getSetting } from "state/settings/selectors";
import { getActiveComplaintGroup } from "state/complaints/selectors";
import { NameDisplayMode } from "ui/types";
import { Loading } from "ui/control";
import Jump from "ui/navigation/Jump";
import { Page } from "ui/page/Page";
import PageHeader from "ui/page/PageHeader";
import { getComplaintHeadingHtml, getComplaintStatusDetails } from "ui/complaints/complaint-details";
import Complaint from "ui/complaints/Complaint";
import ComplaintDecisionEditor from "ui/complaints/ComplaintDecisionEditor";
import ComplaintDecisionView from "ui/complaints/ComplaintDecisionView";
import "./ComplaintDetailsPage.css";

export default function ComplaintsListPage() {
    const complaintGroup = useSelector(getActiveComplaintGroup);
    const loadingGroup = useSelector((state: ClientState) => state.complaints.loadingActive);
    const complaints = useSelector((state: ClientState) => state.complaints.complaints);
    const loadingComplaints = useSelector((state: ClientState) => state.complaints.loadingComplaints);
    const atHomeNode = useSelector(isAtHomeNode);
    const nameDisplayMode = useSelector((state: ClientState) =>
        getSetting(state, "full-name.display") as NameDisplayMode);
    const {t} = useTranslation();

    const {icon: statusIcon, className: statusClass} = getComplaintStatusDetails(complaintGroup?.status);

    let href: string = "/";
    if (complaintGroup?.remotePostingId != null) {
        href = `/post/${complaintGroup.remotePostingId}`;
        if (complaintGroup.remoteCommentId != null) {
            href += `?comment=${complaintGroup.remoteCommentId}`;
        }
    }

    const heading = complaintGroup != null ? getComplaintHeadingHtml(complaintGroup, nameDisplayMode, t) : "";

    return (
        <>
            <PageHeader>
                <h2 className="ms-0">
                    <Jump href="/complaints" className="btn btn-sm btn-outline-secondary">
                        {t("back-to-list-complaints")}
                    </Jump>
                </h2>
            </PageHeader>
            <Page>
                <div className="page-central-pane complaint content-panel">
                    {loadingGroup && <Loading/>}
                    {complaintGroup != null &&
                        <>
                            <h4>
                                <Jump nodeName={complaintGroup.remoteNodeName} href={href}>
                                    <span dangerouslySetInnerHTML={{__html: heading}}/>
                                </Jump>
                            </h4>
                            <div className={cx("status", statusClass)}>
                                <strong>{t("complaint-status-colon")} </strong>
                                {statusIcon && <FontAwesomeIcon icon={statusIcon}/>}
                                {" " + t("complaint-status." + complaintGroup.status)}
                            </div>
                            {loadingComplaints && <Loading/>}
                            {atHomeNode || !complaintGroup.anonymous || complaints.length > 0 ?
                                <>
                                    {complaints.map(complaint =>
                                        <Complaint complaint={complaint}/>
                                    )}
                                </>
                            :
                                <div className="anonymous">{t("sheriff-decided-not-publish-complaints")}</div>
                            }
                            {atHomeNode ?
                                (complaintGroup.status !== "posted" &&
                                    <ComplaintDecisionEditor group={complaintGroup}/>
                                )
                            :
                                ((complaintGroup.status === "approved"
                                        || (complaintGroup.status === "rejected" && complaintGroup.decisionDetails)) &&
                                    <ComplaintDecisionView/>
                                )
                            }
                        </>
                    }
                </div>
            </Page>
        </>
    );
}
