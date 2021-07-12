export interface ConfirmBoxState {
    show: boolean,
    message: string | null,
    yes: string,
    no: string,
    onYes: any,
    onNo: any,
    variant: string
}
