import React, { useRef } from 'react';
import * as ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { feedStatusUpdate } from "state/feeds/actions";
import { getFeedState } from "state/feeds/selectors";
import { PopoverContext } from "ui/control";
import { useOverlay } from "ui/overlays/overlays";
import MobileBack from "ui/page/MobileBack";
import Instants from "ui/instant/Instants";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";
import { BUILD_NUMBER } from "build-number";

interface Props {
    instantBorder: number;
    onClose: () => void;
}

export default function InstantsDialog({instantBorder, onClose}: Props) {
    const stories = useSelector((state: ClientState) => getFeedState(state, REL_HOME, "instant").stories);
    const instantsRef = useRef<HTMLDivElement>(null);
    const [zIndex, overlayId] = useOverlay(instantsRef, {onClose});
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onReadAll = () => {
        if (stories.length === 0) {
            return;
        }
        dispatch(feedStatusUpdate(REL_HOME, "instant", null, true, stories[0].moment));
    }

    return ReactDOM.createPortal(
        <PopoverContext.Provider value={{hide: onClose, update: () => {}, overlayId}}>
            <div id="instants" style={{zIndex: zIndex?.widget}} ref={instantsRef}>
                <MobileBack
                    href="/news"
                    onBack={onClose}
                    menuItems={[
                        {
                            title: t("mark-all-read"),
                            nodeName: REL_CURRENT,
                            href: "/",
                            onClick: onReadAll,
                            show: stories.length > 0

                        }
                    ]}
                >
                    {t("instants")}
                </MobileBack>
                <div className="content">
                    <Instants instantBorder={instantBorder}/>
                </div>
                <div className="footer">
                    <div className="build-number">rev {BUILD_NUMBER}</div>
                </div>
            </div>
        </PopoverContext.Provider>,
        document.getElementById("modal-root")!
    );
}
