import { AvatarDescription, AvatarImage } from "api/node/api-types";

export function toAvatarDescription(avatarImage: AvatarImage, optional: boolean = true): AvatarDescription | null {
    return avatarImage && avatarImage.mediaId ? {
        mediaId: avatarImage.mediaId,
        shape: avatarImage.shape ?? "circle",
        optional
    } : null;
}
