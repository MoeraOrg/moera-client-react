import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { VerificationStatus } from "state/state-types";
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
                <span className="signature-verify" title={t("verify-signature")} onClick={onVerify}>
                    <FontAwesomeIcon icon={["far", "user"]} size="sm"/>
                </span>
            );
        case "running":
            return (
                <span className="signature-verify-running" title={t("signature-verification-in-progress")}>
                    <FontAwesomeIcon icon="user-clock" size="sm"/>
                </span>
            );
        case "correct":
            return (
                <span className="signature-verify-correct" title={t("signature-correct")}>
                    <FontAwesomeIcon icon="user-check" size="sm"/>
                </span>
            );
        case "incorrect":
            return (
                <span className="signature-verify-incorrect" title={t("signature-incorrect")}>
                    <FontAwesomeIcon icon="user-times" size="sm"/>
                </span>
            );
    }
}
