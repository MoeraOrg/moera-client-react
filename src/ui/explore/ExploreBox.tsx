import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { Tabs } from "ui/control";
import Jump from "ui/navigation/Jump";
import TrendingPost from "ui/explore/TrendingPost";
import "./ExploreBox.css";

const MAX_ITEMS = 6;

type ExploreBoxTab = "discussions" | "posts";

export default function ExploreBox() {
    const [activeTab, setActiveTab] = useState<ExploreBoxTab>("discussions");
    const loadingDiscussions = useSelector((state: ClientState) => state.explore.loadingDiscussions);
    const discussions = useSelector((state: ClientState) => state.explore.discussions.slice(0, MAX_ITEMS));
    const loadingTrending = useSelector((state: ClientState) => state.explore.loadingTrending);
    const trending = useSelector((state: ClientState) => state.explore.trending.slice(0, MAX_ITEMS));
    const {t} = useTranslation();

    if (loadingDiscussions || loadingTrending || (discussions.length === 0 && trending.length === 0)) {
        return null;
    }

    const posts = activeTab === "discussions" ? discussions : trending;
    const seeAllHref = activeTab === "discussions" ? "/explore/discussions" : "/explore/trending";
    const counters = activeTab === "discussions"
        ? ["comments" as const, "reactions-icon" as const]
        : ["reactions" as const, "comments-icon" as const];

    return (
        <div id="explore-box">
            <div className="title">{t("trending")}</div>
            <Tabs tabs={[
                {title: t("discussions"), value: "discussions"},
                {title: t("posts"), value: "posts"}
            ]} value={activeTab} onChange={setActiveTab}/>
            <div className="content">
                {posts.map((post, index) => <TrendingPost key={index} trending={post} counters={counters} small/>)}
                {posts.length === MAX_ITEMS &&
                    <Jump href={seeAllHref} className="btn see-all">{t("see-all")}</Jump>
                }
            </div>
        </div>
    );
}
