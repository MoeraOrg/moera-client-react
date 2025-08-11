import React from 'react';
import { useTranslation } from 'react-i18next';

import { VerificationStatus } from "state/state-types";
import { Icon, msPerson, msPersonCancel, msPersonCheck, msPersonSearch } from "ui/material-symbols";
import "./SignatureVerifyButton.css";

interface Props {
    status: VerificationStatus | null;
    onVerify: () => void;
}

export function SignatureVerifyButton({status, onVerify}: Props) {
    const {t} = useTranslation();

    switch (status) {
        default:
        case "none":
            return (
                <span
                    className="signature-verify-button signature-verify"
                    title={t("verify-signature")}
                    onClick={onVerify}
                >
                    <Icon icon={msPerson} size="1.1em"/>
                </span>
            );
        case "running":
            return (
                <span
                    className="signature-verify-button signature-verify-running"
                    title={t("signature-verification-in-progress")}
                >
                    <Icon icon={msPersonSearch} size="1.1em"/>
                </span>
            );
        case "correct":
            return (
                <span
                    className="signature-verify-button signature-verify-correct"
                    title={t("signature-correct")}
                >
                    <Icon icon={msPersonCheck} size="1.1em"/>
                </span>
            );
        case "incorrect":
            return (
                <span
                    className="signature-verify-button signature-verify-incorrect"
                    title={t("signature-incorrect")}
                >
                    <Icon icon={msPersonCancel} size="1.1em"/>
                </span>
            );
    }
}
