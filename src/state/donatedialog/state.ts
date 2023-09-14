import { FundraiserInfo } from "api";

export interface DonateDialogState {
    show: boolean;
    name: string;
    fullName: string | null;
    fundraisers: FundraiserInfo[];
}
