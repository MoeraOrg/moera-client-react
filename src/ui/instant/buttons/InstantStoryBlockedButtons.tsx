import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getHomeOwnerName } from "state/home/selectors";
import { openBlockingDetailsDialog } from "state/blockingdetailsdialog/actions";
import { Button } from "ui/control";
import { InstantStoryButtonsProps } from "ui/instant/buttons/InstantStoryButtons";

type Props = InstantStoryButtonsProps & ConnectedProps<typeof connector>;

function InstantStoryBlockedButtons({story, hide, homeOwnerName, openBlockingDetailsDialog}: Props) {
    const {t} = useTranslation();

    const onClick = () => {
        if (homeOwnerName != null && story.remoteNodeName != null) {
            hide();
            openBlockingDetailsDialog(homeOwnerName, story.remoteNodeName, story.remotePostingId ?? null,
                story.summaryData?.posting?.heading ?? null, true);
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

const connector = connect(
    (state: ClientState) => ({
        homeOwnerName: getHomeOwnerName(state)
    }),
    { openBlockingDetailsDialog }
);

export default connector(InstantStoryBlockedButtons);
