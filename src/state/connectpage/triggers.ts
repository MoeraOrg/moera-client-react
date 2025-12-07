import { trigger } from "state/trigger";
import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { updateLocation } from "state/navigation/actions";
import { connectPageSetForm, ConnectPageSetFormAction } from "state/connectpage/actions";

export default [
    trigger(
        "CONNECT_PAGE_SET_FORM",
        (state: ClientState, signal: ConnectPageSetFormAction) =>
            signal.payload.form === "change" && !isConnectedToHome(state),
        () => connectPageSetForm(undefined, undefined, "connect")
    ),
    trigger("CONNECT_PAGE_SET_FORM", true, updateLocation)
];
