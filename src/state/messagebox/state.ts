export interface MessageBoxState {
    show: boolean;
    message: string | null;
    onClose: any;
    parentOverlayId: string | undefined;
}
