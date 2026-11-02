import { isImageType, isVectorImageType } from "util/mime-type";

jest.mock('mime', () => ({}));

test.each([
    "image/svg+xml",
    "image/svg+xml-compressed",
    "image/emf",
    "image/x-emf",
    "image/wmf",
    "image/x-wmf",
    "image/x-win-metafile",
    "image/x-eps",
    "image/cdr",
    "image/x-cdr",
    "image/cgm",
    "image/vnd.dwg",
    "image/vnd.dxf"
])("classifies %s as a vector document", mimeType => {
    expect(isVectorImageType(mimeType)).toBe(true);
    expect(isImageType(mimeType)).toBe(false);
});

test.each<[string | null | undefined, boolean]>([
    ["image/png", true],
    ["image/jpeg", true],
    ["image/gif", true],
    ["image/bmp", true],
    ["text/plain", false],
    ["video/mp4", false],
    ["application/postscript", false],
    ["application/pdf", false],
    [null, false],
    [undefined, false]
])("classifies non-vector MIME type %p as an image: %p", (mimeType, expected) => {
    expect(isVectorImageType(mimeType)).toBe(false);
    expect(isImageType(mimeType)).toBe(expected);
});
