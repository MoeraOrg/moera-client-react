export class ServiceWorkerService {

    static _forRegistration(callback) {
        if (!window.navigator.serviceWorker) {
            return;
        }

        window.navigator.serviceWorker.getRegistration().then(registration => {
            if (registration) {
                callback(registration);
            }
        });
    }

    static _postMessage(message) {
        this._forRegistration(registration => {
            if (registration.active) {
                registration.active.postMessage(message);
            }
        });
    }

    static sendHomeLocation(location) {
        this._postMessage({
            type: "HOME_ROOT_PAGE",
            location
        });
    }

    static closeAllNotifications() {
        this._forRegistration(registration => registration.getNotifications()
            .then(notifications => notifications.forEach(notification => notification.close())))
    }

}
