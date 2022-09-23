export interface ConfirmBoxState {
    show: boolean,
    message: string | null,
    yes: string | null,
    no: string | null,
    onYes: any,
    onNo: any,
    variant: string
}
