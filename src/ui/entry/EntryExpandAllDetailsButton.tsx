import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { tTitle } from "i18n";
import { Button } from "ui/control";

interface Props {
    contentRef: React.RefObject<HTMLDivElement | null>;
}

export default function EntryExpandAllDetailsButton({contentRef}: Props) {
    const {t} = useTranslation();

    const [collapseAll, setCollapseAll] = useState(false);

    useEffect(() => {
        const details = Array.from(contentRef.current?.querySelectorAll("details") ?? []);
        if (details.length === 0) {
            return;
        }

        const onToggle = () => {
            setCollapseAll(details.every(d => d.open));
        };
        onToggle();

        details.forEach(d => {
            d.addEventListener("toggle", onToggle);
        });
        return () => {
            details.forEach(d => {
                d.removeEventListener("toggle", onToggle);
            });
        };
    }, [contentRef]);

    const onDetailsToggleAll = () => {
        const details = contentRef.current?.querySelectorAll("details");
        if (details == null || details.length === 0) {
            return;
        }
        const nextOpen = !Array.from(details).every(d => d.open);
        details.forEach(d => {
            d.open = nextOpen;
        });
        setCollapseAll(nextOpen);
    }

    return (
        <Button variant="outline-secondary" size="sm" className="mt-1 mb-2 ms-1" onClick={onDetailsToggleAll}>
            {tTitle(collapseAll ? t("collapse-all") : t("expand-all"))}
        </Button>
    );
}
