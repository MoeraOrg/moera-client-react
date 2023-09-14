import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans, useTranslation } from 'react-i18next';

import { CLIENT_SETTINGS_PREFIX } from "api";
import { ClientState } from "state/state";
import { getOwnerName } from "state/node/selectors";
import { closeQuickTips } from "state/quicktips/actions";
import { settingsUpdate } from "state/settings/actions";
import { getSetting } from "state/settings/selectors";
import { Browser } from "ui/browser";
import { Button, ModalDialog } from "ui/control";
import NodeName from "ui/nodename/NodeName";
import Jump, { JumpCallback } from "ui/navigation/Jump";
import "./QuickTips.css";

type Props = ConnectedProps<typeof connector>;

function QuickTips({show, ownerName, shown, closeQuickTips, settingsUpdate}: Props) {
    const {t} = useTranslation();

    if (!show) {
        return null;
    }

    const onClose = () => {
        closeQuickTips();
        if (!shown) {
            settingsUpdate([{
                name: CLIENT_SETTINGS_PREFIX + "invitation.quick-tips.shown",
                value: "true"
            }]);
        }
    };

    const onJump = (href: string, performJump: () => void) => {
        onClose();
        performJump();
    }

    const variant = Browser.isTinyScreen()? "mobile" : "desktop";

    return (
        <ModalDialog className="quick-tips" title={t("quick-tips.title")} onClose={onClose}>
            <div className="modal-body">
                <ul>
                    <li className="new-post">
                        <Trans i18nKey={`quick-tips.new-post-${variant}`}>
                            <NewPostButton/>
                        </Trans>
                    </li>
                    {ownerName &&
                        <li className="visit">
                            <Trans i18nKey={`quick-tips.visit-${variant}`}>
                                <NodeName name={ownerName} linked={false} popup={false}/>
                            </Trans>
                        </li>
                    }
                    <li className="subscribe">
                        <Trans i18nKey={"quick-tips.subscribe"}>
                            <SubscribeButton/>
                        </Trans>
                    </li>
                    <li className="blog">
                        {t(`quick-tips.blog-buttons-${variant}`)}
                        <p>
                            <button><FontAwesomeIcon icon="newspaper"/></button>
                            {" "}&mdash; {t("quick-tips.your-news")}<br/>
                            <button><FontAwesomeIcon icon="bell"/></button>
                            {" "}&mdash; {t("quick-tips.your-notifications")}<br/>
                            <button><FontAwesomeIcon icon="cog"/></button>
                            {" "}&mdash; {t("quick-tips.your-settings")}<br/>
                            <button><FontAwesomeIcon icon="home"/></button>
                            {" "}&mdash; {t("quick-tips.your-timeline")}
                        </p>
                    </li>
                    <li>
                        <Trans i18nKey="quick-tips.discover-blogs">
                            <ListOfBlogsLink onJump={onJump}/>
                        </Trans>
                    </li>
                </ul>
            </div>
            <div className="modal-footer">
                <Button variant="primary" block onClick={onClose} autoFocus>{t("close")}</Button>
            </div>
        </ModalDialog>
    );
}

function NewPostButton() {
    const {t} = useTranslation();

    return (
        <Button variant="success" size="sm">
            <FontAwesomeIcon icon="pen-alt"/>&nbsp;&nbsp;{t("new-post-button")}
        </Button>
    );
}

function SubscribeButton() {
    const {t} = useTranslation();

    return (
        <Button variant="outline-primary" size="sm">
            {t("subscribe")}
            &nbsp;&nbsp;
            <FontAwesomeIcon icon="chevron-down"/>
        </Button>
    );
}

interface ListOfBlogsLinkProps {
    children?: any;
    onJump: JumpCallback;
}

const ListOfBlogsLink = ({children, onJump}: ListOfBlogsLinkProps) => (
    <Jump nodeName="moera-activity-blog_0" href="/post/9f838e8f-d419-4c89-8908-06ae029d2482"
          onNear={onJump} onFar={onJump}>
        <b>{children}</b>
    </Jump>
);

const connector = connect(
    (state: ClientState) => ({
        show: state.quickTips.show,
        ownerName: getOwnerName(state),
        shown: getSetting(state, "invitation.quick-tips.shown") as boolean
    }),
    { closeQuickTips, settingsUpdate }
);

export default connector(QuickTips);
