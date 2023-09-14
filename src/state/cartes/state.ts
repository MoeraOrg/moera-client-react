import { CarteInfo } from "api";

export interface CartesState {
    initialized: boolean;
    cartesIp: string | null;
    cartes: CarteInfo[];
    clockOffset: number;
    clockOffsetWarned: boolean;
}
