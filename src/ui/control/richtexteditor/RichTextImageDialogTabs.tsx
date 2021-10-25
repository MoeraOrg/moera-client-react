import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import { useField } from 'formik';

import { Browser } from "ui/browser";
import "./RichTextImageDialogTabs.css";

export default function RichTextImageDialogTabs() {
    const [{onBlur}, {value}, {setValue}] = useField<string>("source");

    return (
        <ul className="nav nav-tabs rich-text-image-dialog-tabs" onBlur={onBlur}>
            <li className="nav-item">
                    <span className={cx("nav-link", {"active": value === "device"})}
                          onClick={() => setValue("device")}>
                        {Browser.isTinyScreen() ?
                            <><FontAwesomeIcon icon="mobile-alt"/> From Device</>
                        :
                            <><FontAwesomeIcon icon="desktop"/> From Computer</>
                        }
                    </span>
            </li>
            <li className="nav-item">
                    <span className={cx("nav-link", {"active": value === "internet"})}
                          onClick={() => setValue("internet")}>
                        <FontAwesomeIcon icon="globe-europe"/> From Internet
                    </span>
            </li>
        </ul>
    );
}
