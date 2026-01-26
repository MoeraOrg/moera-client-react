import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { tTitle } from "i18n";
import { ClientState } from "state/state";
import { isAtHomeNode } from "state/node/selectors";
import { getRelNodeNameContext } from "state/home/selectors";
import { feedUnset } from "state/feeds/actions";
import { getFeedState } from "state/feeds/selectors";
import { Button } from "ui/control";
import Jump from "ui/navigation/Jump";
import { ReactComponent as NoPosts } from "ui/feed/nocontent/NoPosts.isvg";
import { ReactComponent as NoNews } from "ui/feed/nocontent/NoNews.isvg";
import { ReactComponent as NotFound } from "ui/detailedposting/NotFound.isvg";
import { absoluteNodeName, REL_HOME, RelNodeName } from "util/rel-node-name";
import "./FeedNoContent.css";

interface Props {
    nodeName: RelNodeName | string;
    feedName: string;
}

export default function FeedNoContent({nodeName, feedName}: Props) {
    const nodeNameContext = useSelector(getRelNodeNameContext);
    const atHome = useSelector(isAtHomeNode);
    const cannotBeLoaded = useSelector((state: ClientState) => getFeedState(state, nodeName, feedName).cannotBeLoaded);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onTryAgain = () => dispatch(feedUnset(absoluteNodeName(nodeName, nodeNameContext), feedName));

    if (cannotBeLoaded) {
        return (
            <>
                <div className="feed-no-content">
                    <NotFound/>
                    <div className="caption">{tTitle(t("content-not-found"))}</div>
                    <div className="instructions">{t("node-not-found-content-cannot-loaded")}</div>
                    <Button variant="primary" onClick={onTryAgain}>{tTitle(t("try-again"))}</Button>
                </div>
                <div className="feed-after-end"/>
            </>
        );
    }

    return (
        <>
            <div className="feed-no-content">
                {feedName === "timeline" &&
                    <>
                        <NoPosts/>
                        <div className="caption">{tTitle(t("no-posts-yet"))}</div>
                        <div className="instructions">
                            {atHome ? t("you-havent-posted-anything") : t("user-havent-posted-anything")}
                        </div>
                        {atHome &&
                            <Jump nodeName={REL_HOME} href="/compose" className="btn btn-primary">
                                {t("write-new-post")}
                            </Jump>
                        }
                    </>
                }
                {feedName === "news" &&
                    <>
                        <NoNews/>
                        <div className="caption">{tTitle(t("empty-feed"))}</div>
                        <div className="instructions">{t("feed-currently-empty")}</div>
                    </>
                }
                {feedName === "explore" &&
                    <>
                        <NoNews/>
                        <div className="caption">{tTitle(t("no-recommendations"))}</div>
                        <div className="instructions">{t("nothing-to-recommend")}</div>
                    </>
                }
            </div>
            <div className="feed-after-end"/>
        </>
    );
}
