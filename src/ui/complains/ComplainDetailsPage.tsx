import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { complainsPastSliceLoad } from "state/complains/actions";
import { getActiveComplainGroup } from "state/complains/selectors";
import { NameDisplayMode } from "ui/types";
import { Loading } from "ui/control";
import Jump from "ui/navigation/Jump";
import { Page } from "ui/page/Page";
import PageHeader from "ui/page/PageHeader";
import { getComplainHeadingHtml, getComplainStatusDetails } from "ui/complains/complain-details";
import Complain from "ui/complains/Complain";
import ComplainDecisionEditor from "ui/complains/ComplainDecisionEditor";
import "./ComplainDetailsPage.css";

type Props = ConnectedProps<typeof connector>;

function ComplainsListPage({complainGroup, loadingGroup, complains, loadingComplains, nameDisplayMode}: Props) {
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
                    <Loading active={loadingGroup}/>
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
                            <Loading active={loadingComplains}/>
                            {complains.map(complain =>
                                <Complain complain={complain}/>
                            )}
                            {complainGroup.status !== "posted" &&
                                <ComplainDecisionEditor/>
                            }
                        </>
                    }
                </div>
            </Page>
        </>
    );
}

const connector = connect(
    (state: ClientState) => ({
        complainGroup: getActiveComplainGroup(state),
        loadingGroup: state.complains.loadingActive,
        complains: state.complains.complains,
        loadingComplains: state.complains.loadingComplains,
        nameDisplayMode: getSetting(state, "full-name.display") as NameDisplayMode
    }),
    { complainsPastSliceLoad }
);

export default connector(ComplainsListPage);
