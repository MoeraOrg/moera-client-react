import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { getHomeOwnerName } from "state/home/selectors";
import { openBlockingDetailsDialog } from "state/blockingdetailsdialog/actions";
import { Button } from "ui/control";
import { InstantStoryButtonsProps } from "ui/instant/buttons/InstantStoryButtons";

export default function InstantStoryBlockedButtons({story, hide}: InstantStoryButtonsProps) {
    const homeOwnerName = useSelector(getHomeOwnerName);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClick = () => {
        if (homeOwnerName != null && story.remoteNodeName != null) {
            hide();
            dispatch(openBlockingDetailsDialog(homeOwnerName, story.remoteNodeName, story.remotePostingId ?? null,
                story.summaryData?.posting?.heading ?? null, true));
        }
    }

    return (
        <div className="buttons">
            <Button variant="outline-secondary" size="sm" compact onClick={onClick}>
                {t("details-blocking")}
            </Button>
        </div>
    )
}
