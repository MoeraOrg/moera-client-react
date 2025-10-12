import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { tTitle } from "i18n";
import { isAtHomeNode } from "state/node/selectors";
import Jump from "ui/navigation/Jump";
import { ReactComponent as NoPosts } from "ui/feed/nocontent/NoPosts.isvg";
import { ReactComponent as NoNews } from "ui/feed/nocontent/NoNews.isvg";
import { REL_HOME } from "util/rel-node-name";
import "./FeedNoContent.css";

interface Props {
    feedName: string;
}

export default function FeedNoContent({feedName}: Props) {
    const atHome = useSelector(isAtHomeNode);
    const {t} = useTranslation();

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
