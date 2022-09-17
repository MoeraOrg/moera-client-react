import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';

import { Browser } from "ui/browser";
import "./RichTextImageDialogTabs.css";

export default function RichTextImageDialogTabs() {
    const [{onBlur}, {value}, {setValue}] = useField<string>("source");
    const {t} = useTranslation();

    return (
        <ul className="nav nav-tabs rich-text-image-dialog-tabs" onBlur={onBlur}>
            <li className="nav-item">
                    <span className={cx("nav-link", {"active": value === "device"})}
                          onClick={() => setValue("device")}>
                        {Browser.isTinyScreen() ?
                            <><FontAwesomeIcon icon="mobile-alt"/> {t("from-device")}</>
                        :
                            <><FontAwesomeIcon icon="desktop"/> {t("from-computer")}</>
                        }
                    </span>
            </li>
            <li className="nav-item">
                    <span className={cx("nav-link", {"active": value === "internet"})}
                          onClick={() => setValue("internet")}>
                        <FontAwesomeIcon icon="globe-europe"/> {t("from-internet")}
                    </span>
            </li>
        </ul>
    );
}
