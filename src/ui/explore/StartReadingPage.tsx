import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import * as immutable from 'object-path-immutable';

import { tTitle } from "i18n";
import { ClientState } from "state/state";
import { getSettingNode } from "state/settings/selectors";
import { feedSubscribe } from "state/feeds/actions";
import { Avatar, Loading } from "ui/control";
import { Icon, msAddCircle, msCheck } from "ui/material-symbols";
import Jump from "ui/navigation/Jump";
import GlobalTitle from "ui/mainmenu/GlobalTitle";
import NodeName from "ui/nodename/NodeName";
import { REL_HOME } from "util/rel-node-name";
import "./StartReadingPage.css";

export default function StartReadingPage() {
    const loading = useSelector((state: ClientState) => state.explore.loadingActivePeople);
    const autoSubscription = useSelector((state: ClientState) => getSettingNode(state, "subscription.auto.node"));
    const people = useSelector((state: ClientState) =>
        state.explore.activePeople.filter(p => p.nodeName !== autoSubscription).slice(0, 10)
    );
    const [selection, setSelection] = useState<Record<string, boolean>>({});
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClick = (nodeName: string) => () => {
        const subscribed = selection[nodeName] ?? false;
        if (!subscribed) {
            setSelection(immutable.set(selection, [nodeName], true));
            dispatch(feedSubscribe(nodeName, "timeline", null, true));
        }
    }

    return (
        <>
            <GlobalTitle/>
            <main className="start-reading-page global-page">
                <div className="title">{tTitle(t("most-active-blogs"))}</div>
                {people.map(node => {
                    const subscribed = selection[node.nodeName] ?? false;

                    return (
                        <div className="person" key={node.nodeName}>
                            <Avatar ownerName={node.nodeName} avatar={node.avatar} size={48}/>
                            <div className="details">
                                <NodeName className="full-name" name={node.nodeName} fullName={node.fullName}
                                          display="full-name" linked={false} popup={false}/>
                                <span className="name">
                                    <Trans i18nKey="count-posts" values={{count: node.postingsTotal}}>
                                        <span/>
                                    </Trans>
                                    {", "}
                                    <Trans i18nKey="count-subscribers" values={{count: node.subscribersTotal}}>
                                        <span/>
                                    </Trans>
                                </span>
                            </div>
                            <span className="blog-title">{node.title}</span>
                            {!subscribed ?
                                <button
                                    type="button"
                                    className="btn subscribe-button"
                                    title={t("subscribe")}
                                    onClick={onClick(node.nodeName)}
                                >
                                    <Icon icon={msAddCircle} size={18}/>
                                </button>
                            :
                                <div className="subscribe-button"><Icon icon={msCheck} size={18}/></div>
                            }
                        </div>
                    );
                })}
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
