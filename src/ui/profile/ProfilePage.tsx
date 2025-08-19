import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { NodeName } from "api";
import { ClientState } from "state/state";
import { isProfileEditable } from "state/profile/selectors";
import { getOwnerCard, getOwnerName } from "state/node/selectors";
import { Avatar, DonateButton, Loading } from "ui/control";
import Jump from "ui/navigation/Jump";
import FeedSubscribeButton from "ui/feed/FeedSubscribeButton";
import { Page } from "ui/page/Page";
import PageHeader from "ui/page/PageHeader";
import PageShareButton from "ui/page/PageShareButton";
import NodeNameView from "ui/profile/view/NodeNameView";
import EntryHtml from "ui/entry/EntryHtml";
import { shortGender } from "util/names";
import { REL_CURRENT } from "util/rel-node-name";
import "./ProfilePage.css";

function EditButton() {
    const {t} = useTranslation();

    return (
        <Jump className="btn btn-sm btn-outline-primary ms-3" href="/settings/profile#profile">
            {t("edit")}
        </Jump>
    );
}

export default function ProfilePage() {
    const loading = useSelector((state: ClientState) => getOwnerCard(state)?.details?.loading ?? true);
    const profile = useSelector((state: ClientState) => getOwnerCard(state)?.details?.profile);
    const ownerName = useSelector(getOwnerName);
    const editable = useSelector(isProfileEditable);
    const {t} = useTranslation();

    return (
        <>
            <PageHeader>
                <h2>
                    {t("profile")}
                    {" "}<FeedSubscribeButton nodeName={REL_CURRENT} feedName="timeline"/>
                    {" "}{editable && <EditButton/>}
                    <PageShareButton href="/profile"/>
                </h2>
            </PageHeader>
            <Page>
                <div className="page-central-pane profile-view content-panel">
                    <Avatar avatar={profile?.avatar} ownerName={ownerName} size={200}/>
                    {loading && <Loading/>}
                    <div className="full-name">
                        {profile?.fullName ?? NodeName.shorten(ownerName)}
                        {profile?.gender && <span className="gender">{shortGender(profile.gender, t)}</span>}
                    </div>
                    <NodeNameView/>
                    {profile?.title && <div className="title">{profile.title}</div>}
                    <DonateButton name={ownerName} fullName={profile?.fullName ?? null}
                                  fundraisers={profile?.fundraisers ?? null} className="donate"/>
                    {profile?.email &&
                        <div className="email">
                            <span className="title">{t("e-mail")}:</span>{" "}
                            <a href={`mailto:${profile.email}`}>{profile.email}</a>
                        </div>
                    }
                    {profile?.bioHtml && <EntryHtml className="bio" html={profile.bioHtml} nodeName={REL_CURRENT}/>}
                </div>
            </Page>
        </>
    );
}
