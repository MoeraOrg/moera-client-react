export function trimNodeLocation(location: string): string {
    const trimmed = location.trim();

    return trimmed.startsWith("@") ? trimmed.substring(1) : trimmed;
}
