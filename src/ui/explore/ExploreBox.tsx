import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { Tabs } from "ui/control";
import Jump from "ui/navigation/Jump";
import TrendingPost from "ui/explore/TrendingPost";
import "./ExploreBox.css";

type ExploreBoxTab = "discussions" | "posts";

export default function ExploreBox() {
    const [activeTab, setActiveTab] = useState<ExploreBoxTab>("discussions");
    const loadingDiscussions = useSelector((state: ClientState) => state.explore.loadingDiscussions);
    const discussions = useSelector((state: ClientState) => state.explore.discussions.slice(0, 5));
    const loadingTrending = useSelector((state: ClientState) => state.explore.loadingTrending);
    const trending = useSelector((state: ClientState) => state.explore.trending.slice(0, 5));
    const {t} = useTranslation();

    if (loadingDiscussions || loadingTrending || (discussions.length === 0 && trending.length === 0)) {
        return null;
    }

    const posts = activeTab === "discussions" ? discussions : trending;
    const seeAllHref = activeTab === "discussions" ? "/explore/discussions" : "/explore/trending";
    const counters = activeTab === "discussions" ? ["comments" as const] : ["reactions" as const];

    return (
        <div id="explore-box">
            <div className="title">{t("trending")}</div>
            <Tabs tabs={[
                {title: t("discussions"), value: "discussions"},
                {title: t("posts"), value: "posts"}
            ]} value={activeTab} onChange={setActiveTab}/>
            {posts.map((post, index) => <TrendingPost key={index} trending={post} counters={counters} small/>)}
            {posts.length === 5 &&
                <Jump href={seeAllHref} className="btn see-all">{t("see-all")}</Jump>
            }
        </div>
    );
}
