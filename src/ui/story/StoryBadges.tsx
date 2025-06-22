import React from 'react';
import { useTranslation } from 'react-i18next';

import { Icon, msKeepFilled16 } from "ui/material-symbols";
import "./StoryBadges.css";

interface Props {
    pinned?: boolean | null;
    recommended?: boolean | null;
}

export default function StoryBadges({pinned, recommended}: Props) {
    const {t} = useTranslation();

    if (!pinned && !recommended) {
        return null;
    }

    return (
        <div className="badges-line">
            {pinned &&
                <span className="pinned badge bg-secondary">
                    <Icon icon={msKeepFilled16} size={9}/> {t("pinned-post")}
                </span>
            }
            {recommended &&
                <span className="recommended badge bg-success">
                    {t("recommended-post")}
                </span>
            }
        </div>
    );
}
