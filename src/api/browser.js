import { randomId } from "util/misc";

export class Browser {

    static clientId = randomId();

    static storeData(data) {
        window.postMessage({
            source: "moera",
            action: "storeData",
            payload: {
                ...data,
                clientId: Browser.clientId
            }
        }, "*");
    }

    static storeHomeData(location, login, token, permissions, cartesIp, cartes) {
        Browser.storeData({home: {location, login, token, permissions}, cartesIp, cartes});
    }

}
