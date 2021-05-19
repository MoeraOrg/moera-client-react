export function toAvatarDescription(avatarImage, optional = true) {
    return avatarImage && avatarImage.mediaId ? {
        mediaId: avatarImage.mediaId,
        shape: avatarImage.shape,
        optional
    } : null;
}
