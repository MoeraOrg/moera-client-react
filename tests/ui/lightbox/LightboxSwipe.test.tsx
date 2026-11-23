import { act, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import Lightbox from "ui/lightbox/Lightbox";
import type { LightboxSource } from "ui/lightbox/lightbox-source";

jest.mock("ui/control", () => ({
    Loading: () => null,
    VideoPlayer: ({className}: {className: string}) => (
        <div className={className}>
            <video/>
            <div className="media-controls"><div className="media-slider__track"/></div>
        </div>
    )
}));
jest.mock("ui/hook/media-query", () => ({useIsTinyScreen: () => false}));
jest.mock("ui/hook", () => ({
    ...jest.requireActual("ui/hook/focus-trap"),
    ...jest.requireActual("ui/hook/managed-timeout"),
    ...jest.requireActual("ui/hook/parent-context"),
    ...jest.requireActual("ui/hook/size")
}));
jest.mock("react-i18next", () => ({useTranslation: () => ({t: (key: string) => key})}));

const images: LightboxSource[] = ["first.jpg", "second.jpg", "third.jpg"].map(url => ({
    type: "image", url, previewUrl: undefined, width: 600, height: 400
}));

function Gallery({start = 1, sources = images}: {start?: number; sources?: LightboxSource[]}) {
    const [index, setIndex] = useState(start);
    return (
        <Lightbox
            mainSrc={sources[index]} prevSrc={sources[index - 1]} nextSrc={sources[index + 1]}
            onMovePrev={() => setIndex(index - 1)} onMoveNext={() => setIndex(index + 1)}
            controls={[]} toolbarButtons={[]}
        />
    );
}

let root: Root;
let modal: HTMLDivElement;

beforeEach(() => {
    Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true});
    modal = document.createElement("div");
    modal.id = "modal-root";
    document.body.append(modal);
    root = createRoot(document.createElement("div"));
    jest.spyOn(window, "Image").mockImplementation(() => {
        const img = document.createElement("img");
        img.width = 600;
        img.height = 400;
        Object.defineProperty(img, "src", {set: () => img.dispatchEvent(new Event("load"))});
        return img;
    });
});

afterEach(() => {
    act(() => root.unmount());
    modal.remove();
    jest.restoreAllMocks();
});

function image(section: "prev" | "main" | "next"): HTMLImageElement {
    return modal.querySelector<HTMLImageElement>(`.lightbox-image-${section}`)!;
}

function xPosition(element: HTMLElement): number {
    return Number(/translate3d\(([-.\d]+)px,/.exec(element.style.transform)?.[1]);
}

function pointer(
    type: string, x: number, y: number, pointerType = "touch", pointerId = 1,
    target: EventTarget = type === "pointerdown" ? image("main") : window
): void {
    const event = Object.assign(new MouseEvent(type, {
        bubbles: true, cancelable: true, clientX: x, clientY: y,
        buttons: type === "pointerdown" || type === "pointermove" ? 1 : 0
    }), {pointerType, pointerId});
    act(() => { target.dispatchEvent(event); });
}

test.each<[string, "prev" | "next", number]>([
    ["touch", "next", -240],
    ["mouse", "prev", 240]
])("%s drag reveals the %s image before release", (device: string, direction: "prev" | "next", delta: number) => {
    act(() => root.render(<Gallery/>));
    const current = image("main");
    const neighbor = image(direction);
    const neighborStart = xPosition(neighbor);
    pointer("pointerdown", 400, 300, device);
    pointer("pointermove", 400 + delta, 300, device);

    expect(xPosition(current)).toBe(delta);
    expect(xPosition(neighbor)).toBe(neighborStart + delta);
    expect(current.style.transition).toBe("");

    pointer("pointerup", 400 + delta, 300, device);
    expect(image("main")).toBe(neighbor);
    expect(xPosition(neighbor)).toBe(0);
    expect(neighbor.style.transition).toContain("transform");
});

test.each<[string, number, number]>([
    ["pointerup", 60, 0],
    ["pointerup", 240, 200],
    ["pointercancel", 240, 0]
])("recenters the same image after %s at (%i, %i)", (end: string, dx: number, dy: number) => {
    act(() => root.render(<Gallery/>));
    const current = image("main");
    pointer("pointerdown", 400, 300);
    pointer("pointermove", 400 + dx, 300 + dy);
    pointer(end, 400 + dx, 300 + dy);

    expect(image("main")).toBe(current);
    expect(xPosition(current)).toBe(0);
    expect(current.style.transition).toContain("transform");
    act(() => current.click());
    expect(modal.querySelector(".lightbox-outer")!.classList.contains("transparent")).toBe(false);
});

test("keeps the first image at the edge and follows the pointer when it reverses", () => {
    act(() => root.render(<Gallery start={0}/>));
    pointer("pointerdown", 400, 300);
    pointer("pointermove", 650, 300);
    expect(xPosition(image("main"))).toBe(0);
    pointer("pointermove", 320, 300);
    expect(xPosition(image("main"))).toBe(-80);
    expect(xPosition(image("next"))).toBe(window.innerWidth - 80);
});

test("switches from dragging the slides to zooming and panning the current image", () => {
    act(() => root.render(<Gallery/>));
    const current = image("main");
    const neighbor = image("next");
    pointer("pointerdown", 600, 300);
    pointer("pointermove", 200, 300);
    pointer("pointerdown", 850, 300, "touch", 2, neighbor);
    expect(xPosition(current)).toBe(0);
    expect(xPosition(neighbor)).toBe(window.innerWidth);

    pointer("pointermove", 910, 300, "touch", 2);
    expect(current.style.cursor).toBe("move");
    pointer("pointerup", 910, 300, "touch", 2);
    const panStart = xPosition(current);
    pointer("pointermove", 240, 300);
    expect(xPosition(current)).toBe(panStart + 40);
    expect(xPosition(neighbor)).toBe(window.innerWidth);
    pointer("pointerup", 240, 300);
    expect(image("main")).toBe(current);
});

function openVideo() {
    const video: LightboxSource = {...images[1], type: "video", url: "clip.mp4"};
    act(() => root.render(<Gallery sources={[images[0], video, images[2]]}/>));
    const current = modal.querySelector<HTMLElement>(".lightbox-video-main")!;
    const player = current.querySelector<HTMLElement>(".lightbox-video-player")!;
    return {current, player, surface: player.querySelector("video")!};
}

test.each(["touch", "mouse"])("%s swipe on a video moves the gallery and consumes the tap", (device: string) => {
    const {current, player, surface} = openVideo();
    const next = image("next");
    const playerRelease = jest.fn();
    player.addEventListener("pointerup", playerRelease);

    pointer("pointerdown", 400, 300, device, 1, surface);
    pointer("pointermove", 160, 300, device, 1, surface);
    expect(xPosition(current)).toBe(-240);
    expect(xPosition(next)).toBe(window.innerWidth - 240);
    pointer("pointerup", 160, 300, device, 1, surface);
    expect(image("main")).toBe(next);
    expect(playerRelease).not.toHaveBeenCalled();
});

test("a short video drag is consumed even after reversing back to its starting point", () => {
    const {current, player, surface} = openVideo();
    const playerRelease = jest.fn();
    player.addEventListener("pointerup", playerRelease);

    pointer("pointerdown", 400, 300, "touch", 1, surface);
    pointer("pointermove", 360, 300, "touch", 1, surface);
    pointer("pointermove", 400, 300, "touch", 1, surface);
    pointer("pointerup", 400, 300, "touch", 1, surface);
    expect(current.classList.contains("lightbox-video-main")).toBe(true);
    expect(playerRelease).not.toHaveBeenCalled();

    pointer("pointerdown", 400, 300, "touch", 1, surface);
    pointer("pointerup", 401, 300, "touch", 1, surface);
    expect(playerRelease).toHaveBeenCalledTimes(1);
});

test("dragging the player's seek slider leaves the video in place", () => {
    const {current, player} = openVideo();
    const slider = player.querySelector(".media-slider__track")!;
    const playerRelease = jest.fn();
    slider.addEventListener("pointerup", playerRelease);

    pointer("pointerdown", 400, 300, "mouse", 1, slider);
    pointer("pointermove", 160, 300, "mouse", 1, slider);
    expect(xPosition(current)).toBe(0);
    pointer("pointerup", 160, 300, "mouse", 1, slider);
    expect(playerRelease).toHaveBeenCalledTimes(1);
    expect(current.classList.contains("lightbox-video-main")).toBe(true);
});

test("a fullscreen video keeps its own gestures", () => {
    const {current, player, surface} = openVideo();
    Object.defineProperty(document, "fullscreenElement", {configurable: true, value: player});
    try {
        pointer("pointerdown", 400, 300, "touch", 1, surface);
        pointer("pointermove", 160, 300, "touch", 1, surface);
        expect(xPosition(current)).toBe(0);
        pointer("pointerup", 160, 300, "touch", 1, surface);
        expect(current.classList.contains("lightbox-video-main")).toBe(true);
    } finally {
        Reflect.deleteProperty(document, "fullscreenElement");
    }
});
