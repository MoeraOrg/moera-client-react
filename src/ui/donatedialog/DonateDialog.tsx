import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';
import QRCode from 'react-qr-code';

import { ClientSettings, NodeName } from "api";
import { FundraiserInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { closeDonateDialog } from "state/donatedialog/actions";
import { settingsUpdate } from "state/settings/actions";
import { getSetting } from "state/settings/selectors";
import { ModalDialog } from "ui/control";
import FundraiserIcon from "ui/donatedialog/FundraiserIcon";
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

type Props = ConnectedProps<typeof connector>;

function DonateDialog({show, name, fullName, fundraisers, autoPreferred, preferredPrefix, closeDonateDialog,
                       settingsUpdate}: Props) {
    const [fundraiserIndex, setFundraiserIndex] = useState<number>(0);

    useEffect(
        () => setFundraiserIndex(getPreferredFundraiserIndex(fundraisers, preferredPrefix)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [show, fundraisers]
    );

    if (!show || fundraisers.length === 0) {
        return null;
    }

    const shortName = NodeName.shorten(name);
    const recipientName = fullName ? `${fullName} (@${shortName})` : `@${shortName}`;
    const fundraiser = fundraisers[fundraiserIndex];

    const onClick = (index: number) => () => {
        setFundraiserIndex(index);
        if (autoPreferred) {
            settingsUpdate([{
                name: ClientSettings.PREFIX + "fundraiser.preferred.prefix",
                value: getSchemeOrDomain(fundraisers[index].href) ?? getSchemeOrDomain(fundraisers[index].qrCode)
            }]);
        }
    }

    return (
        <ModalDialog title="Donate" className="donate-dialog" onClose={closeDonateDialog}>
            <div className="modal-body">
                <div className="recipient">Donate to <span className="name">{recipientName}</span></div>
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
                                <a href={fundraiser.href ?? undefined} target="_blank" rel="noreferrer">
                                    <QRCode value={fundraiser.qrCode} size={256} level={"Q"}/>
                                </a>
                                {fundraiser.text && <><br/>{fundraiser.text}</>}
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

const connector = connect(
    (state: ClientState) => ({
        show: state.donateDialog.show,
        name: state.donateDialog.name,
        fullName: state.donateDialog.fullName,
        fundraisers: state.donateDialog.fundraisers,
        autoPreferred: getSetting(state, "fundraiser.preferred.auto") as boolean,
        preferredPrefix: getSetting(state, "fundraiser.preferred.prefix") as string
    }),
    { closeDonateDialog, settingsUpdate }
);

export default connector(DonateDialog);
