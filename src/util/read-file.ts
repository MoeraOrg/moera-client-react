export function readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((
        resolve: (value: ArrayBuffer | PromiseLike<ArrayBuffer>) => void,
        reject: (reason?: unknown) => void
    ) => {
        const reader = new FileReader();
        reader.onload = function () {
            resolve(this.result as ArrayBuffer);
        }
        reader.onabort = function () {
            reject("FileReader aborted");
        }
        reader.onerror = function () {
            reject("FileReader failed");
        }
        reader.readAsArrayBuffer(file);
    });
}
