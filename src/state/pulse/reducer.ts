import { PULSE_1MIN } from "state/pulse/actions";
import { PulseState } from "state/pulse/state";
import { ClientAction } from "state/action";

const initialState = {
    pulse: 0
};

export default (state: PulseState = initialState, action: ClientAction): PulseState => {
    switch (action.type) {
        case PULSE_1MIN:
            return {
                pulse: state.pulse + 1
            }

        default:
            return state;
    }
}
