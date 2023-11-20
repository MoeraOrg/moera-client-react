import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isAtHomeNode } from "state/node/selectors";
import { getSetting } from "state/settings/selectors";
import { getActiveComplainGroup } from "state/complains/selectors";
import { NameDisplayMode } from "ui/types";
import { Loading } from "ui/control";
import Jump from "ui/navigation/Jump";
import { Page } from "ui/page/Page";
import PageHeader from "ui/page/PageHeader";
import { getComplainHeadingHtml, getComplainStatusDetails } from "ui/complains/complain-details";
import Complain from "ui/complains/Complain";
import ComplainDecisionEditor from "ui/complains/ComplainDecisionEditor";
import ComplainDecisionView from "ui/complains/ComplainDecisionView";
import "./ComplainDetailsPage.css";

export default function ComplainsListPage() {
    const complainGroup = useSelector(getActiveComplainGroup);
    const loadingGroup = useSelector((state: ClientState) => state.complains.loadingActive);
    const complains = useSelector((state: ClientState) => state.complains.complains);
    const loadingComplains = useSelector((state: ClientState) => state.complains.loadingComplains);
    const atHomeNode = useSelector(isAtHomeNode);
    const nameDisplayMode = useSelector((state: ClientState) =>
        getSetting(state, "full-name.display") as NameDisplayMode);
    const {t} = useTranslation();

    const {icon: statusIcon, className: statusClass} = getComplainStatusDetails(complainGroup?.status);

    let href: string = "/";
    if (complainGroup?.remotePostingId != null) {
        href = `/post/${complainGroup.remotePostingId}`;
        if (complainGroup.remoteCommentId != null) {
            href += `comment=${complainGroup.remoteCommentId}`;
        }
    }

    const heading = complainGroup != null ? getComplainHeadingHtml(complainGroup, nameDisplayMode, t) : "";

    return (
        <>
            <PageHeader>
                <h2 className="ms-0">
                    <Jump href="/complains" className="btn btn-sm btn-outline-secondary">
                        {t("back-to-list-complains")}
                    </Jump>
                </h2>
            </PageHeader>
            <Page>
                <div className="complain content-panel">
                    {loadingGroup && <Loading/>}
                    {complainGroup != null &&
                        <>
                            <h4>
                                <Jump nodeName={complainGroup.remoteNodeName} href={href}>
                                    <span dangerouslySetInnerHTML={{__html: heading}}/>
                                </Jump>
                            </h4>
                            <div className={cx("status", statusClass)}>
                                <strong>{t("complain-status-colon")} </strong>
                                {statusIcon && <FontAwesomeIcon icon={statusIcon}/>}
                                {" " + t("complain-status." + complainGroup.status)}
                            </div>
                            {loadingComplains && <Loading/>}
                            {atHomeNode || !complainGroup.anonymous || complains.length > 0 ?
                                <>
                                    {complains.map(complain =>
                                        <Complain complain={complain}/>
                                    )}
                                </>
                            :
                                <div className="anonymous">{t("sheriff-decided-not-publish-complains")}</div>
                            }
                            {atHomeNode ?
                                (complainGroup.status !== "posted" &&
                                    <ComplainDecisionEditor group={complainGroup}/>
                                )
                            :
                                ((complainGroup.status === "approved"
                                        || (complainGroup.status === "rejected" && complainGroup.decisionDetails)) &&
                                    <ComplainDecisionView/>
                                )
                            }
                        </>
                    }
                </div>
            </Page>
        </>
    );
}
