export interface ConfirmBoxState {
    show: boolean,
    message: string | null,
    yes: string | null,
    no: string | null,
    cancel: string | null,
    onYes: any,
    onNo: any,
    onCancel: any,
    variant: string
}
