import { type ImageInfo } from "ui/lightbox/lightbox-image-loader";
import { type LightboxSource } from "ui/lightbox/lightbox-source";
import LightboxImage from "ui/lightbox/LightboxImage";
import LightboxVideo from "ui/lightbox/LightboxVideo";

interface Props {
    source: LightboxSource;
    imageInfo: ImageInfo | null;
    section: "prev" | "main" | "next";
    autoPlay?: boolean;
    transforms: {
        x?: number;
        y?: number;
        zoom?: number;
    };
}

export default function LightboxMedia({source, imageInfo, section, autoPlay, transforms}: Props) {
    if (source.type === "image") {
        return <LightboxImage imageInfo={imageInfo} className={`lightbox-image-${section}`} transforms={transforms}/>;
    } else {
        return <LightboxVideo src={source.url} className={`lightbox-video-${section}`} autoPlay={autoPlay}/>;
    }
}
