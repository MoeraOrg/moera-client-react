import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { getHomeOwnerName } from "state/home/selectors";
import { openSheriffOrderDetailsDialog } from "state/sherifforderdetailsdialog/actions";
import { Button } from "ui/control";
import { InstantStoryButtonsProps } from "ui/instant/buttons/InstantStoryButtons";

export default function InstantStorySheriffOrderButtons({story, hide}: InstantStoryButtonsProps) {
    const homeOwnerName = useSelector(getHomeOwnerName);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClick = () => {
        if (homeOwnerName != null && story.remoteNodeName != null && story.summaryData?.sheriff?.orderId != null) {
            hide();
            dispatch(openSheriffOrderDetailsDialog(story.remoteNodeName, story.summaryData.sheriff.orderId));
        }
    }

    return (
        <div className="buttons">
            <Button variant="outline-secondary" size="sm" compact onClick={onClick}>
                {t("details")}
            </Button>
        </div>
    )
}
