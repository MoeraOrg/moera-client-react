import { CarteInfo } from "api";

export interface ServiceWorkerSetCartesMessage {
    type: "SET_CARTES";
    payload: {
        cartes: CarteInfo[]
    }
}

export const serviceWorkerSetCartesMessage = (cartes: CarteInfo[]): ServiceWorkerSetCartesMessage => ({
    type: "SET_CARTES", payload: {cartes}
});

export type ServiceWorkerMessage =
    ServiceWorkerSetCartesMessage;
