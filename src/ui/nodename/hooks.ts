import { useSelector } from 'react-redux';

import { getSetting } from "state/settings/selectors";
import { ClientState } from "state/state";
import { NameDisplayMode } from "ui/types";

export function useNameDisplayMode(): NameDisplayMode {
    return useSelector((state: ClientState) => getSetting(state, "full-name.display") as NameDisplayMode);
}
