import { ClientAction } from "state/action";
import { MediaDownloadDialogState } from "state/mediadownloaddialog/state";

const initialState: MediaDownloadDialogState = {
    show: false,
    nodeName: "",
    mediaId: "",
    errorCode: "media.download-pending",
    media: null
};

export default (state: MediaDownloadDialogState = initialState, action: ClientAction): MediaDownloadDialogState => {
    switch (action.type) {
        case "OPEN_MEDIA_DOWNLOAD_DIALOG":
            return {
                ...initialState,
                show: true,
                nodeName: action.payload.nodeName,
                mediaId: action.payload.mediaId
            };

        case "CLOSE_MEDIA_DOWNLOAD_DIALOG":
            return {
                ...state,
                show: false
            };

        case "MEDIA_DOWNLOAD_SUCCEEDED":
            if (action.payload.nodeName === state.nodeName && action.payload.mediaId === state.mediaId) {
                return {
                    ...state,
                    errorCode: null,
                    media: action.payload.media
                };
            } else {
                return state;
            }

        case "MEDIA_DOWNLOAD_FAILED":
            if (action.payload.nodeName === state.nodeName && action.payload.mediaId === state.mediaId) {
                return {
                    ...state,
                    errorCode: action.payload.errorCode
                };
            } else {
                return state;
            }

        default:
            return state;
    }
}
