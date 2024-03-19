import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { storySatisfy } from "state/stories/actions";
import { ExtStoryInfo } from "state/feeds/state";
import { Button } from "ui/control";
import { REL_HOME } from "util/rel-node-name";

export interface InstantStoryButtonsProps {
    story: ExtStoryInfo;
    hide: () => void;
}

interface Props extends InstantStoryButtonsProps {
    ready: boolean;
    accepting: boolean;
    accepted: boolean;
    acceptTitle: string;
    acceptedTitle: string;
    onAccept: () => void;
}

export function InstantStoryButtons({story, ready, accepting, accepted, acceptTitle, acceptedTitle, onAccept}: Props) {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    if (!ready) {
        return null;
    }

    const onIgnore = () => dispatch(storySatisfy(REL_HOME, "instant", story.id));

    return (
        <div className="buttons">
            {!accepted ?
                !story.satisfied &&
                    <>
                        <Button variant="primary" size="sm" compact loading={accepting} onClick={onAccept}>
                            {acceptTitle}
                        </Button>
                        <Button variant="secondary" size="sm" compact onClick={onIgnore}>{t("ignore")}</Button>
                    </>
            :
                <span className="message">
                    <span className="check"><FontAwesomeIcon icon="check"/></span>
                    {acceptedTitle}
                </span>
            }
        </div>
    );
}
