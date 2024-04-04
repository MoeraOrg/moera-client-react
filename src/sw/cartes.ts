/* eslint-disable no-restricted-globals */

import { CarteInfo } from "api";
import { ServiceWorkerMessage } from "sw/message-types";
import { now } from "util/misc";

interface CartesState {
    cartes: CarteInfo[];
}

const cartes: CartesState = {
    cartes: []
};

export function getCurrentCarte(): string | null {
    const current = now();
    const carte = cartes.cartes.find(carte => carte.beginning <= current && carte.deadline >= current);
    return carte ? carte.carte : null;
}

export function registerMessageReceiver() {
    self.onmessage = (e: MessageEvent) => {
        const message = e.data as ServiceWorkerMessage;
        switch (message.type) {
            case "SET_CARTES": {
                cartes.cartes = message.payload.cartes;
                break;
            }
        }
    }
}
