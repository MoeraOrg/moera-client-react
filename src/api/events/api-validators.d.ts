import { BasicValidateFunction } from "api/schema";

declare const EVENT_VALIDATORS: Partial<Record<string, BasicValidateFunction<any>>>;
