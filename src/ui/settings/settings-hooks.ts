import { useCallback, useEffect, useState } from 'react';
import { Property } from 'csstype';

export function useSettingsSheetResize(): Property.MaxHeight {
    const [sheetMaxHeight, setSheetMaxHeight] = useState<Property.MaxHeight>("none");

    const onResize = useCallback(() => setSheetMaxHeight(calcListMaxHeight()), []);

    useEffect(() => {
        window.addEventListener("resize", onResize);
        setSheetMaxHeight(calcListMaxHeight());

        return () => window.removeEventListener("resize", onResize);
    }, [onResize]);

    return sheetMaxHeight;
}

function calcListMaxHeight() {
    const sheetElement = document.getElementsByClassName("settings-sheet").item(0);
    if (sheetElement == null) {
        return "none";
    }
    const buttonsElement = document.getElementsByClassName("settings-buttons").item(0);
    if (buttonsElement == null) {
        return "none";
    }
    const topHeight = sheetElement.getBoundingClientRect().top + window.scrollY;
    const bottomHeight = buttonsElement.getBoundingClientRect().height + 40;
    const maxHeight = window.innerHeight - topHeight - bottomHeight;
    return `${maxHeight}px`;
}
