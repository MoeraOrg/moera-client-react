export async function createVideoThumbnail(file: File, targetWidth: number, targetHeight: number): Promise<Blob> {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");

    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    try {
        video.src = url;

        await waitForEvent(video, "loadedmetadata");

        if (!video.videoWidth || !video.videoHeight) {
            throw new Error("Video has no decodable video track");
        }

        // Roughly at 10% of the video, but not later than 1s from the beginning
        const requestedTime = Math.min(1, Math.max(0, video.duration * 0.1));

        // Not in the last 1% of the video
        const safeTime = Number.isFinite(video.duration)
            ? Math.min(requestedTime, Math.max(0, video.duration - 0.01))
            : requestedTime;

        if (safeTime > 0) {
            video.currentTime = safeTime;
            await waitForEvent(video, "seeked");
        } else {
            await waitForEvent(video, "loadeddata");
        }

        const scale = Math.min(
            1,
            Math.max(
                targetWidth / video.videoWidth,
                targetHeight / video.videoHeight
            )
        );

        const width = Math.max(1, Math.round(video.videoWidth * scale));
        const height = Math.max(1, Math.round(video.videoHeight * scale));

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) {
            throw new Error("Canvas 2D is not supported");
        }

        context.drawImage(video, 0, 0, width, height);

        return await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
                blob => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error("Could not encode video thumbnail"));
                    }
                },
                "image/jpeg",
                0.85
            );
        });
    } finally {
        video.removeAttribute("src");
        video.load();
        URL.revokeObjectURL(url);
    }
}

function waitForEvent(
    target: HTMLMediaElement,
    eventName: "loadedmetadata" | "loadeddata" | "seeked"
): Promise<void> {
    return new Promise((resolve, reject) => {
        const cleanup = () => {
            target.removeEventListener(eventName, onSuccess);
            target.removeEventListener("error", onError);
        };

        const onSuccess = () => {
            cleanup();
            resolve();
        };

        const onError = () => {
            cleanup();

            const mediaError = target.error;
            reject(
                new Error(
                    mediaError
                        ? `Cannot decode video: MediaError ${mediaError.code}`
                        : "Cannot decode video"
                )
            );
        };

        target.addEventListener(eventName, onSuccess, {once: true});
        target.addEventListener("error", onError, {once: true});
    });
}
