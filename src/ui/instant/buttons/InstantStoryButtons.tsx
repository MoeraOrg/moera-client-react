import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { StoryInfo } from "api/node/api-types";
import { ClientAction } from "state/action";
import { storySatisfy } from "state/stories/actions";
import { ExtStoryInfo } from "state/feeds/state";
import { Button } from "ui/control";

export type InstantStoryButtonsActionSupplier = (story: StoryInfo) => ClientAction | null | undefined;

export interface InstantStoryButtonsProps {
    story: ExtStoryInfo;
}

type Props = InstantStoryButtonsProps & {
    ready: boolean;
    accepting: boolean;
    accepted: boolean;
    acceptTitle: string;
    acceptedTitle: string;
    onAccept: () => void;
};

function InstantStoryButtonsImpl({story, ready, accepting, accepted, acceptTitle, acceptedTitle, onAccept}: Props) {
    const {t} = useTranslation();

    if (!ready) {
        return null;
    }

    const onIgnore = () => storySatisfy(":instant", story.id);

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
    )
}
const connector = connect(
    null,
    { storySatisfy }
);

export const InstantStoryButtons = connector(InstantStoryButtonsImpl);
