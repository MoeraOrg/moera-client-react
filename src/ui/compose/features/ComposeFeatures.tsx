import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { SourceFormat } from "api";
import { isComposeReady } from "state/compose/selectors";
import { Button, Tabs } from "ui/control";
import ComposeBodyFormat from "ui/compose/features/ComposeBodyFormat";
import ComposeComments from "ui/compose/features/ComposeComments";
import ComposeReactions from "ui/compose/features/ComposeReactions";
import ComposeUpdateInfo from "ui/compose/features/ComposeUpdateInfo";
import "./ComposeFeatures.css";

interface Props {
    sourceFormats: SourceFormat[];
    updateInfo: boolean;
}

type FeatureTab = "format" | "comments" | "reactions" | "updated";

export default function ComposeFeatures({sourceFormats, updateInfo}: Props) {
    const ready = useSelector(isComposeReady);

    const [visible, setVisible] = React.useState<boolean>(false);
    const [tab, setTab] = React.useState<FeatureTab>("format");
    const {t} = useTranslation();

    if (!ready) {
        return null;
    }

    const onToggle = (e: React.MouseEvent) => {
        setVisible(!visible);
        e.preventDefault();
    }

    return (
        <>
            <Button variant="link" className="compose-features-button" onClick={onToggle}>
                {visible ? t("close-advanced-options") : t("advanced-options")}
            </Button>

            {visible &&
                <div className="mb-4">
                    <Tabs<FeatureTab> tabs={[
                        {
                            title: t("text-formatting"),
                            value: "format"
                        },
                        {
                            title: t("comments"),
                            value: "comments"
                        },
                        {
                            title: t("reactions"),
                            value: "reactions"
                        },
                        {
                            title: t("notify-followers"),
                            value: "updated",
                            visible: updateInfo
                        }
                    ]} className="mb-3" value={tab} onChange={setTab}/>

                    {tab === "format" && <ComposeBodyFormat sourceFormats={sourceFormats}/>}
                    {tab === "comments" && <ComposeComments/>}
                    {tab === "reactions" && <ComposeReactions/>}
                    {tab === "updated" && <ComposeUpdateInfo/>}
                </div>
            }
        </>
    );
}
