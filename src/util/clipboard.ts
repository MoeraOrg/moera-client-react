// based on https://github.com/feross/clipboard-copy

function makeError(): DOMException {
    return new DOMException("The request is not allowed", "NotAllowedError");
}

async function copyClipboardApi(text: string, html?: string): Promise<void> {
    // Use the Async Clipboard API when available. Requires a secure browsing
    // context (i.e. HTTPS)
    if (!navigator.clipboard) {
        throw makeError();
    }
    if (html) {
        return navigator.clipboard.write([new ClipboardItem({
            "text/plain": text,
            "text/html": html
        })]);
    } else {
        return navigator.clipboard.writeText(text);
    }
}

async function copyExecCommand(text: string): Promise<void> {
    // Put the text to copy into a <span>
    const span = document.createElement("span");
    span.textContent = text;

    // Preserve consecutive spaces and newlines
    span.style.whiteSpace = "pre";
    span.style.webkitUserSelect = "auto";
    span.style.userSelect = "all";

    // Add the <span> to the page
    document.body.appendChild(span);

    // Make a selection object representing the range of text selected by the user
    const selection = window.getSelection();
    if (selection == null) {
        return;
    }

    const range = window.document.createRange();
    selection.removeAllRanges();
    range.selectNode(span);
    selection.addRange(range);

    // Copy text to the clipboard
    let success = false;
    try {
        success = window.document.execCommand("copy");
    } finally {
        // Cleanup
        selection.removeAllRanges();
        window.document.body.removeChild(span);
    }

    if (!success) {
        throw makeError();
    }
}

export async function clipboardCopy(text: string, html?: string): Promise<void> {
    try {
        await copyClipboardApi(text, html)
    } catch (err) {
        // ...Otherwise, use document.execCommand() fallback
        try {
            await copyExecCommand(text)
        } catch (err2) {
            throw (err2 || err || makeError())
        }
    }
}
