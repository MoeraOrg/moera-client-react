import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import ComplainsListPage from "ui/complains/ComplainsListPage";
import ComplainDetailsPage from "ui/complains/ComplainDetailsPage";
import "./ComplainsListPage.css";

type Props = ConnectedProps<typeof connector>;

const ComplainsPage = ({activeComplainGroupId}: Props) =>
    activeComplainGroupId == null ?
        <ComplainsListPage/>
    :
        <ComplainDetailsPage/>;

const connector = connect(
    (state: ClientState) => ({
        activeComplainGroupId: state.complains.activeComplainGroupId
    })
);

export default connector(ComplainsPage);
