import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { NodeName } from "api";
import { ClientState } from "state/state";
import { getOwnerAvatar, getOwnerFullName, getOwnerName, getOwnerTitle } from "state/node/selectors";
import { Avatar, DonateButton } from "ui/control";
import Jump from "ui/navigation/Jump";
import { mentionName } from "util/misc";
import "./FeedTitle.css";

export default function FeedTitle() {
    const nodeName = useSelector(getOwnerName);
    const fullName = useSelector(getOwnerFullName);
    const title = useSelector(getOwnerTitle);
    const avatar = useSelector(getOwnerAvatar);
    const fundraisers = useSelector((state: ClientState) => state.profile.profile.fundraisers);
    const {t} = useTranslation();

    return (
        <div id="feed-title">
            <div className="panel">
                <Jump href="/profile" title={t("profile")} className="avatar-link">
                    <Avatar avatar={avatar} ownerName={nodeName} size={100}/>
                </Jump>
                <div className="body">
                    <div className="full-name">
                        {fullName || NodeName.shorten(nodeName)}
                        <DonateButton name={nodeName} fullName={fullName} fundraisers={fundraisers ?? null}
                                      styles="icon"/>
                    </div>
                    <div className="mention">{mentionName(nodeName)}</div>
                    {title && <div className="title">{title}</div>}
                </div>
            </div>
        </div>
    );
}
