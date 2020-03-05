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

    static storeConnectionData(location, login, token, permissions) {
        Browser.storeData({home: {location, login, token, permissions}});
    }

    static storeCartesData(cartesIp, cartes) {
        Browser.storeData({cartesIp, cartes});
    }

    static deleteData(location) {
        window.postMessage({
            source: "moera",
            action: "deleteData",
            payload: location
        }, "*");
    }

}
