import { FundraiserInfo } from "api/node/api-types";

export interface DonateDialogState {
    show: boolean;
    name: string;
    fullName: string | null;
    fundraisers: FundraiserInfo[];
}
