import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';
import QRCode from 'react-qr-code';

import { NodeName } from "api";
import { ClientState } from "state/state";
import { closeDonateDialog } from "state/donatedialog/actions";
import { ModalDialog } from "ui/control";
import "./DonateDialog.css";

type Props = ConnectedProps<typeof connector>;

function DonateDialog({show, name, fullName, fundraisers, closeDonateDialog}: Props) {
    const [fundraiserIndex, setFundraiserIndex] = useState<number>(0);

    useEffect(() => setFundraiserIndex(0), [show]);

    if (!show || fundraisers.length === 0) {
        return null;
    }

    const shortName = NodeName.shorten(name);
    const recipientName = fullName ? `${fullName} (@${shortName})` : `@${shortName}`;
    const fundraiser = fundraisers[fundraiserIndex];

    const onClick = (index: number) => () => setFundraiserIndex(index);

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
        fundraisers: state.donateDialog.fundraisers
    }),
    { closeDonateDialog }
);

export default connector(DonateDialog);
