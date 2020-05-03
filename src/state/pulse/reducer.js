import { PULSE_1MIN } from "state/pulse/actions";

const initialState = {
    pulse: 0
};

export default (state = initialState, action) => {
    switch (action.type) {
        case PULSE_1MIN:
            return {
                pulse: state.pulse + 1
            }

        default:
            return state;
    }
}
