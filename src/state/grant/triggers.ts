import { conj, trigger } from "state/trigger";
import { isAtGrantPage } from "state/navigation/selectors";
import { isGrantToBeValidated } from "state/grant/selectors";
import { grantValidate } from "state/grant/actions";

export default [
    trigger("GO_TO_PAGE", conj(isAtGrantPage, isGrantToBeValidated), grantValidate)
];
