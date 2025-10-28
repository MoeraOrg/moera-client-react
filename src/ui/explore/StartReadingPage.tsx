import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { NodeName as NodeNameFormat } from "api";
import { tTitle } from "i18n";
import { ClientState } from "state/state";
import GlobalTitle from "ui/mainmenu/GlobalTitle";
import { Avatar, Loading } from "ui/control";
import Jump from "ui/navigation/Jump";
import NodeName from "ui/nodename/NodeName";
import { REL_HOME } from "util/rel-node-name";
import "./StartReadingPage.css";

export default function StartReadingPage() {
    const loading = useSelector((state: ClientState) => state.explore.loadingActivePeople);
    const people = useSelector((state: ClientState) => state.explore.activePeople.slice(0, 10));
    const {t} = useTranslation();

    return (
        <>
            <GlobalTitle/>
            <main className="start-reading-page global-page">
                <div className="title">{tTitle(t("most-active-blogs"))}</div>
                {people.map(node =>
                    <div className="person" key={node.nodeName}>
                        <Avatar ownerName={node.nodeName} avatar={node.avatar} size={48}/>
                        <div className="details">
                            <NodeName className="full-name" name={node.nodeName} fullName={node.fullName}
                                      display="full-name" linked={false} popup={false}/>
                            <span className="name">{NodeNameFormat.shorten(node.nodeName)}</span>
                        </div>
                        <span className="blog-title">{node.title}</span>
                    </div>
                )}
                {loading ?
                    <Loading/>
                :
                    <Jump nodeName={REL_HOME} href="/news" className="btn btn-primary submit-button">
                        {t("continue")}
                    </Jump>
                }
            </main>
        </>
    );
}
