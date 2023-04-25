import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getHomeOwnerName } from "state/home/selectors";
import { Button } from "ui/control";
import { InstantStoryButtonsProps } from "ui/instant/buttons/InstantStoryButtons";
import { openSheriffOrderDetailsDialog } from "state/sherifforderdetailsdialog/actions";

type Props = InstantStoryButtonsProps & ConnectedProps<typeof connector>;

function InstantStorySheriffOrderButtons({story, hide, homeOwnerName, openSheriffOrderDetailsDialog}: Props) {
    const {t} = useTranslation();

    const onClick = () => {
        if (homeOwnerName != null && story.remoteNodeName != null && story.summaryData?.sheriff?.orderId != null) {
            hide();
            openSheriffOrderDetailsDialog(story.remoteNodeName, story.summaryData.sheriff.orderId);
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

const connector = connect(
    (state: ClientState) => ({
        homeOwnerName: getHomeOwnerName(state)
    }),
    { openSheriffOrderDetailsDialog }
);

export default connector(InstantStorySheriffOrderButtons);
