import { CarteInfo } from "api/node/api-types";

export interface CartesState {
    initialized: boolean;
    cartesIp: string | null;
    cartes: CarteInfo[];
    clockOffset: number;
    clockOffsetWarned: boolean;
}
