import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import { ConfirmBoxButtonAction } from "state/confirmbox/state";
import { closeConfirmBox } from "state/confirmbox/actions";
import { Button, Checkbox, ModalDialog } from "ui/control";
import { htmlEntities } from "util/html";

const forwardAction = (action: ClientAction) => action;

type Props = ConnectedProps<typeof connector>;

function ConfirmBox({
    show, message, yes, no, cancel, onYes, onNo, onCancel, variant, dontShowAgainBox, closeConfirmBox, forwardAction
}: Props) {
    const {t} = useTranslation();

    const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);

    if (!show) {
        return null;
    }

    const onClick = (buttonAction: ConfirmBoxButtonAction | null) => {
        closeConfirmBox();
        if (buttonAction) {
            let action: ClientAction | ClientAction[] | null | undefined | void;
            if (typeof(buttonAction) === "function") {
                action = buttonAction(dontShowAgain);
            } else {
                action = buttonAction;
            }
            if (action != null) {
                if (Array.isArray(action)) {
                    action.forEach(forwardAction);
                } else {
                    forwardAction(action);
                }
            }
        }
    };

    const onClickYes = () => onClick(onYes);

    const onClickNo = () => onClick(onNo);

    const onClickCancel = () => onClick(onCancel);

    const onDontShowAgainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDontShowAgain(event.target.checked);
    }

    const escapedMessage = htmlEntities(message ?? "")
        .replaceAll("&lt;b&gt;", "<b>") // <b></b> tag is allowed
        .replaceAll("&lt;/b&gt;", "</b>")
        .replaceAll("&lt;br&gt;", "<br>"); // <br> tag is allowed

    return (
        <ModalDialog risen onClose={onCancel != null ? onClickCancel : onClickNo}>
            <div className="modal-body">
                <div dangerouslySetInnerHTML={{__html: escapedMessage}}/>
                {dontShowAgainBox &&
                    <>
                        <br/>
                        <Checkbox name="dont-show-again" id="dont-show-again" checked={dontShowAgain} value={1}
                                  onChange={onDontShowAgainChange}/>
                        {" "}
                        <label htmlFor="dont-show-again">{t("dont-ask-again")}</label>
                    </>
                }
            </div>
            <div className="modal-footer">
                {onCancel &&
                    <Button variant="outline-secondary" onClick={onClickCancel}>{cancel ?? t("cancel")}</Button>
                }
                <Button variant="secondary" onClick={onClickNo}>{no ?? t("no")}</Button>
                <Button variant={variant} onClick={onClickYes} autoFocus>{yes ?? t("yes")}</Button>
            </div>
        </ModalDialog>
    );
}

const connector = connect(
    (state: ClientState) => state.confirmBox,
    { closeConfirmBox, forwardAction }
);

export default connector(ConfirmBox);
