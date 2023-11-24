import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import QRCode from 'react-qr-code';
import { Trans, useTranslation } from 'react-i18next';

import { CLIENT_SETTINGS_PREFIX, FundraiserInfo, NodeName } from "api";
import { ClientState } from "state/state";
import { closeDonateDialog } from "state/donatedialog/actions";
import { settingsUpdate } from "state/settings/actions";
import { getSetting } from "state/settings/selectors";
import { Button, ModalDialog } from "ui/control";
import FundraiserIcon from "ui/donatedialog/FundraiserIcon";
import { getFundraiserAutoHref } from "ui/donatedialog/fundraiser-util";
import { Browser } from "ui/browser";
import { getSchemeOrDomain, hasSchemeOrDomain } from "util/url";
import "./DonateDialog.css";

function getPreferredFundraiserIndex(fundraisers: FundraiserInfo[], prefix: string): number {
    if (!prefix) {
        return 0;
    }
    const index = fundraisers.findIndex(f =>
        (f.href != null && hasSchemeOrDomain(f.href, prefix))
        || (f.qrCode != null && hasSchemeOrDomain(f.qrCode, prefix)));
    return index >= 0 ? index : 0;
}

export default function DonateDialog() {
    const name = useSelector((state: ClientState) => state.donateDialog.name);
    const fullName = useSelector((state: ClientState) => state.donateDialog.fullName);
    const fundraisers = useSelector((state: ClientState) => state.donateDialog.fundraisers);
    const autoPreferred = useSelector((state: ClientState) =>
        getSetting(state, "fundraiser.preferred.auto") as boolean);
    const preferredPrefix = useSelector((state: ClientState) =>
        getSetting(state, "fundraiser.preferred.prefix") as string);
    const dispatch = useDispatch();

    const [fundraiserIndex, setFundraiserIndex] = useState<number>(0);

    const {t} = useTranslation();

    useEffect(
        () => setFundraiserIndex(getPreferredFundraiserIndex(fundraisers, preferredPrefix)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [fundraisers]
    );

    if (fundraisers.length === 0) {
        return null;
    }

    const onClose = () => dispatch(closeDonateDialog());

    if (Browser.isAndroidGooglePlay()) {
        return (
            <ModalDialog title={t("donate")} className="donate-dialog" onClose={onClose}>
                <div className="modal-body">
                    <Trans i18nKey="donations-android-prohibited">
                        {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
                        <a href="https://support.google.com/googleplay/android-developer/answer/9858738/"/>
                        <br/>
                        <br/>
                    </Trans>
                </div>
                <div className="modal-footer">
                    <Button variant="danger" onClick={onClose}>{t("close")}</Button>
                </div>
            </ModalDialog>
        );
    }

    const shortName = NodeName.shorten(name);
    const recipientName = fullName ? `${fullName} (@${shortName})` : `@${shortName}`;
    const fundraiser = fundraisers[fundraiserIndex];

    const onClick = (index: number) => () => {
        setFundraiserIndex(index);
        if (autoPreferred) {
            dispatch(settingsUpdate([{
                name: CLIENT_SETTINGS_PREFIX + "fundraiser.preferred.prefix",
                value: getSchemeOrDomain(fundraisers[index].href) ?? getSchemeOrDomain(fundraisers[index].qrCode)
            }]));
        }
    }

    return (
        <ModalDialog title={t("donate")} className="donate-dialog" onClose={onClose}>
            <div className="modal-body">
                <div className="recipient">
                    <Trans i18nKey="donate-to-recipient" values={{recipientName}}><span className="name"/></Trans>
                </div>
                <div className="fundraisers">
                    <ul className="nav nav-pills flex-md-column">
                        {fundraisers.map((fundraiser, index) =>
                            <li className="nav-item" key={index}>
                                <span className={cx("nav-link", {"active": fundraiserIndex === index})}
                                      onClick={onClick(index)}>
                                    <FundraiserIcon fundraiser={fundraiser}/>
                                    {fundraiser.title}
                                </span>
                            </li>
                        )}
                    </ul>
                    <div className="info">
                        {fundraiser.qrCode ?
                            <div className="info-qr">
                                <a href={getFundraiserAutoHref(fundraiser)} target="_blank" rel="noreferrer">
                                    <QRCode value={fundraiser.qrCode} size={256} level={"Q"}/>
                                </a>
                                {fundraiser.text && <span className="description"><br/>{fundraiser.text}</span>}
                            </div>
                        :
                            <div className="info-text">
                                {fundraiser.text && <>{fundraiser.text}<br/></>}
                                <a href={fundraiser.href ?? undefined} target="_blank" rel="noreferrer">
                                    {fundraiser.href}
                                </a>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </ModalDialog>
    );
}
