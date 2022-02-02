import { isNumber } from "util/misc";

export type InfoQuantityUnit = "bytes" | "KiB" | "MiB" | "GiB";

const UNIT_FACTORS: Record<InfoQuantityUnit, number> = {
    "bytes": 1,
    "KiB": 1024,
    "MiB": 1024 * 1024,
    "GiB": 1024 * 1024 * 1024
};

export class InfoQuantityParsingError extends Error {

    constructor(value: string) {
        super("Error parsing information quantity value: " + value);
    }

}
export class InfoQuantity {

    static MIN = new InfoQuantity(0, "bytes");
    static MAX = new InfoQuantity(1024, "GiB");

    amount: number;
    unit: InfoQuantityUnit;

    constructor(amount: number, unit: InfoQuantityUnit) {
        this.amount = amount;
        this.unit = unit;
    }

    static parse(v: string | number | null | undefined): InfoQuantity {
        if (v == null) {
            return new InfoQuantity(0, "bytes");
        }
        if (isNumber(v)) {
            return this.ofBytes(v);
        }
        if (v.length === 0) {
            return new InfoQuantity(0, "bytes");
        }
        const [amountS, unit] = v.split(" ");
        if (!unit) {
            return this.ofBytes(parseInt(amountS));
        }
        if (!(unit in UNIT_FACTORS)) {
            throw new InfoQuantityParsingError(v);
        }
        return new InfoQuantity(parseInt(amountS), unit as InfoQuantityUnit)
    }

    static ofBytes(bytes: number | null | undefined): InfoQuantity {
        if (bytes == null || bytes === 0) {
            return new InfoQuantity(0, "bytes");
        }
        for (let [unit, factor] of Object.entries(UNIT_FACTORS).reverse()) {
            if (bytes % factor === 0) {
                return new InfoQuantity(bytes / factor, unit as InfoQuantityUnit);
            }
        }
        throw new Error("Info quantity is a wrong number");
    }

    toBytes(): number {
        return this.amount * UNIT_FACTORS[this.unit];
    }

    toUnitCeil(unit: InfoQuantityUnit): number | null {
        return Math.ceil(this.toBytes() / UNIT_FACTORS[unit]);
    }

    toUnitFloor(unit: InfoQuantityUnit): number | null {
        return Math.floor(this.toBytes() / UNIT_FACTORS[unit]);
    }

    toString(): string {
        return `${this.amount} ${this.unit}`;
    }

}
