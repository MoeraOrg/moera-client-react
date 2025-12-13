import React from 'react';
import { useTranslation } from 'react-i18next';

import { RecommendedPostingInfo } from "api";
import { AvatarWithPopup } from "ui/control";
import Jump from "ui/navigation/Jump";
import NodeName from "ui/nodename/NodeName";

interface Props {
    trending: RecommendedPostingInfo;
}

export default function TrendingPost({trending}: Props) {
    const {t} = useTranslation();

    return (
        <div className="trending-post">
            <AvatarWithPopup ownerName={trending.ownerName} ownerFullName={trending.ownerFullName}
                             avatar={trending.ownerAvatar} size={24}/>
            <NodeName className="owner" name={trending.ownerName} fullName={trending.ownerFullName}/>
            <Jump nodeName={trending.nodeName} href={`/post/${trending.postingId}`} className="heading">
                {trending.heading}
            </Jump>
            <div className="counters">
                {trending.totalPositiveReactions > 0 &&
                    <span>
                        {t("count-reactions", {count: trending.totalPositiveReactions})}
                        {trending.lastDayPositiveReactions > 0 ?
                            " ("
                            + t("count-new-reactions", {count: trending.lastDayPositiveReactions})
                            + ")"
                        :
                            ""
                        }
                    </span>
                }
                {trending.totalComments > 0 &&
                    <span>
                        {t("count-comments", {count: trending.totalComments})}
                        {trending.lastDayComments > 0 ?
                            " (" + t("count-new-comments", {count: trending.lastDayComments}) + ")"
                        :
                            ""
                        }
                    </span>
                }
            </div>
        </div>
    );
}
