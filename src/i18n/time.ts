import { TFunction } from 'i18next';
import {
    differenceInMinutes,
    differenceInHours,
    differenceInDays,
    differenceInWeeks,
    differenceInMonths,
    differenceInYears,
} from 'date-fns';

interface DistanceFormatOptions {
    ago?: boolean;
}

export function tDistanceToNow(past: Date, t: TFunction, options: DistanceFormatOptions = {}): string {
    const suffix = options.ago ? "\xa0" + t("time.ago") : "";
    const now = new Date();

    if (now.getTime() - past.getTime() < 60_000) {
        return t("time.now") + suffix;
    }

    const minutes = differenceInMinutes(now, past);
    if (minutes < 60) {
        return `${minutes}\xa0${t("time.minute.short")}` + suffix;
    }

    const hours = differenceInHours(now, past);
    if (hours < 24) {
        return `${hours}\xa0${t("time.hour.short")}` + suffix;
    }

    const days = differenceInDays(now, past);
    if (days < 14) {
        return `${days}\xa0${t("time.day.short")}` + suffix;
    }

    const weeks = differenceInWeeks(now, past);
    if (weeks < 5) {
        return `${weeks}\xa0${t("time.week.short")}` + suffix;
    }

    const months = differenceInMonths(now, past);
    if (months < 12) {
        return `${months}\xa0${t("time.month.short")}` + suffix;
    }

    const years = differenceInYears(now, past);
    return `${years}\xa0${t("time.year.short")}` + suffix;
}
