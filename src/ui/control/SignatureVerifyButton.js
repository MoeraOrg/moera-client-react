import React from 'react';
import PropType from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./SignatureVerifyButton.css";

export function SignatureVerifyButton({status, onVerify}) {
    switch (status) {
        default:
        case "none":
            return (
                <span className="signature-verify" title="Verify signature" onClick={onVerify}>
                    <FontAwesomeIcon icon={["far", "user"]} size="sm"/>
                </span>
            );
        case "running":
            return (
                <span className="signature-verify-running" title="Signature verification in progress">
                    <FontAwesomeIcon icon="user-clock" size="sm"/>
                </span>
            );
        case "correct":
            return (
                <span className="signature-verify-correct" title="Signature is correct">
                    <FontAwesomeIcon icon="user-check" size="sm"/>
                </span>
            );
        case "incorrect":
            return (
                <span className="signature-verify-incorrect" title="Signature is incorrect">
                    <FontAwesomeIcon icon="user-times" size="sm"/>
                </span>
            );
    }
}

SignatureVerifyButton.propTypes = {
    status: PropType.string,
    onVerify: PropType.func
};
