import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck, faUserClock, faUserTimes } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
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
                    <FontAwesomeIcon icon={faUser} size="sm"/>
                </span>
            );
        case "running":
            return (
                <span className="signature-verify-running" title={t("signature-verification-in-progress")}>
                    <FontAwesomeIcon icon={faUserClock} size="sm"/>
                </span>
            );
        case "correct":
            return (
                <span className="signature-verify-correct" title={t("signature-correct")}>
                    <FontAwesomeIcon icon={faUserCheck} size="sm"/>
                </span>
            );
        case "incorrect":
            return (
                <span className="signature-verify-incorrect" title={t("signature-incorrect")}>
                    <FontAwesomeIcon icon={faUserTimes} size="sm"/>
                </span>
            );
    }
}
