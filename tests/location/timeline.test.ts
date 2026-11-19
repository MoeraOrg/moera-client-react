import { LocationInfo, locationTransform } from "location";

jest.mock("api", () => ({}));
jest.mock("i18n", () => ({}));
jest.mock("ui/browser", () => ({}));
jest.mock("util/media-images", () => ({}));

describe("timeline navigation", () => {
    test.each([
        ["/?before=1234567890123", 1234567890123],
        ["/?before=0", 0],
        ["/", null],
        ["/?before=null", null],
        ["/timeline?before=1234567890123", 1234567890123]
    ])("opens %s at %s", (href: string, at: number | null) => {
        const url = new URL(href, document.baseURI);
        const destination = LocationInfo.fromUrl(url.pathname, url.search, url.hash);

        expect(locationTransform(new LocationInfo(), destination)).toMatchObject([
            {type: "GO_TO_PAGE", payload: {page: "timeline", details: {at}}}
        ]);
    });
});
