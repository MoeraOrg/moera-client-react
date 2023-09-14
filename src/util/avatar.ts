import { AvatarDescription, AvatarImage } from "api";

export function toAvatarDescription(avatarImage: AvatarImage | null | undefined,
                                    optional: boolean = true): AvatarDescription | null {
    return avatarImage && avatarImage.mediaId ? {
        mediaId: avatarImage.mediaId,
        shape: avatarImage.shape ?? "circle",
        optional
    } : null;
}
