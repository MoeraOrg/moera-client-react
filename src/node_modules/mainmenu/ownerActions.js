export const OWNER_NAME_LOAD = "OWNER_NAME_LOAD";
export const ownerNameLoad = () => ({
    type: OWNER_NAME_LOAD
});

export const OWNER_NAME_SET = "OWNER_NAME_SET";
export const ownerNameSet = (name, generation) => ({
    type: OWNER_NAME_SET,
    payload: {name, generation}
});

export const OWNER_NAME_VERIFIED = "OWNER_NAME_VERIFIED";
export const ownerNameVerified = (name, generation, latest, correct) => ({
    type: OWNER_NAME_VERIFIED,
    payload: {name, generation, latest, correct}
});
