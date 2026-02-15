import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import { ClientState } from "state/state";
import { reactionsDialogSelectTab } from "state/reactionsdialog/actions";
import { CloseButton, UnderlinedTabDescription, UnderlinedTabs } from "ui/control";
import { useParent } from "ui/hook";

interface Props {
    hidden?: boolean;
    children?: React.ReactNode;
}

export default function TotalsTabs({hidden, children}: Props) {
    const {loaded, total, emojis} = useSelector((state: ClientState) => state.reactionsDialog.totals);
    const activeTab = useSelector((state: ClientState) => state.reactionsDialog.activeTab);
    const {hide} = useParent();
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const tabs = useMemo<UnderlinedTabDescription<number>[]>(() =>
        hidden ?
            []
        :
            [
                {
                    title: `${t("all")}\xA0\xA0${total}`,
                    value: 0
                },
                ...emojis.map(rt => ({
                    title: `\xA0\xA0${rt.total}`,
                    emoji: rt.emoji,
                    value: rt.emoji
                }))
            ],
        [emojis, hidden, t, total]
    );

    return (
        <UnderlinedTabs className={cx({invisible: !loaded})} tabs={tabs} value={activeTab ?? 0}
                        onChange={tab => dispatch(reactionsDialogSelectTab(tab))}>
            {children}
            <CloseButton onClick={hide}/>
        </UnderlinedTabs>
    );
}
