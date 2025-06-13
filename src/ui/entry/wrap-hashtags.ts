const HASHTAG = /(?:^|[\s([{>])(#[\p{L}\p{Nd}_]+)/gu;

export function wrapHashtags(root: HTMLElement): void {
    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
        {
            acceptNode: (node: Node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;
                    if (["A", "CODE", "PRE", "VIDEO", "AUDIO", "OBJECT", "IFRAME"].includes(element.tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    if (element.classList.contains("katex")) {
                        return NodeFilter.FILTER_REJECT;
                    }
                } else {
                    const text = node.nodeValue;
                    HASHTAG.lastIndex = 0;
                    if (!text || !HASHTAG.test(text)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    const textNodes: Text[] = [];
    let currentNode: Node | null;

    while ((currentNode = walker.nextNode())) {
        if (currentNode.nodeType === Node.TEXT_NODE) {
            textNodes.push(currentNode as Text);
        }
    }

    textNodes.forEach(textNode => {
        const text = textNode.nodeValue;
        if (text == null) {
            return;
        }

        HASHTAG.lastIndex = 0;
        let match: RegExpExecArray | null;
        let lastIndex = 0;
        const fragment = document.createDocumentFragment();

        while ((match = HASHTAG.exec(text)) !== null) {
            const index = !match[0].startsWith("#") ? match.index + 1 : 0;
            if (index > lastIndex) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex, index)));
            }

            const hashtag = match[1];
            const span = document.createElement("span");
            span.setAttribute("data-hashtag", hashtag);
            span.textContent = hashtag;
            fragment.appendChild(span);

            lastIndex = index + hashtag.length;
        }

        if (lastIndex < text.length) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        }

        if (fragment.childNodes.length > 0) {
            textNode.parentNode?.replaceChild(fragment, textNode);
        }
    });
}
