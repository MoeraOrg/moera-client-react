import { act, useContext } from 'react';
import { createRoot } from 'react-dom/client';

import { LightboxContext } from "ui/lightbox/lightbox-context";
import LightboxVideo from "ui/lightbox/LightboxVideo";

jest.mock("ui/control", () => ({Loading: () => null, VideoPlayer: () => null}));

function VideoInLightbox({width, height}: {width: number; height: number}) {
    const lightbox = useContext(LightboxContext);
    return (
        <LightboxContext.Provider value={{...lightbox, boxSize: {width, height}}}>
            <LightboxVideo src="video.mp4" posterSrc={undefined} width={1280} height={1280} transforms={{}}/>
        </LightboxContext.Provider>
    );
}

test.each([
    [991, "991px"],
    [992, "972px"]
])("fits the video into a square viewport %i px wide", (width, expectedSize) => {
    const actEnvironment = Object.getOwnPropertyDescriptor(globalThis, "IS_REACT_ACT_ENVIRONMENT");
    const matchMedia = Object.getOwnPropertyDescriptor(window, "matchMedia");
    Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true});
    Object.defineProperty(window, "matchMedia", {configurable: true, value: (query: string) => ({
        matches: query === "(min-width: 992px)" && width >= 992,
        addEventListener: () => {},
        removeEventListener: () => {}
    })});
    const container = document.createElement("div");
    const root = createRoot(container);

    try {
        act(() => root.render(<VideoInLightbox width={width} height={width}/>));
        const video = container.querySelector<HTMLElement>(".lightbox-video");
        expect(video?.style.width).toBe(expectedSize);
        expect(video?.style.height).toBe(expectedSize);
    } finally {
        act(() => root.unmount());
        if (matchMedia) {
            Object.defineProperty(window, "matchMedia", matchMedia);
        } else {
            Reflect.deleteProperty(window, "matchMedia");
        }
        if (actEnvironment) {
            Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", actEnvironment);
        } else {
            Reflect.deleteProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT");
        }
    }
});
