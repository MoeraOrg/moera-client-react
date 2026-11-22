import { renderToStaticMarkup } from 'react-dom/server';

import PostingViews from "ui/posting/PostingViews";

test("only original postings display a positive view count", () => {
    const original = {viewCount: 7};
    const copy = {...original, receiverName: "origin", receiverPostingId: "original"};
    expect(renderToStaticMarkup(<PostingViews posting={original}/>)).toContain("7");
    expect(renderToStaticMarkup(<PostingViews posting={copy}/>)).toBe("");
    expect(renderToStaticMarkup(<PostingViews posting={{...original, receiverName: "origin"}}/>)).toBe("");
    expect(renderToStaticMarkup(<PostingViews posting={{...original, receiverPostingId: "original"}}/>)).toBe("");
});
