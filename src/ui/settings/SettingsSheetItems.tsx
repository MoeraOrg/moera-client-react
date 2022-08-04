import React from 'react';

import { SettingMetaInfo } from "api/node/api-types";
import { ClientSettingMetaInfo } from "api/settings";
import { Item } from "ui/settings/settings-menu";
import SettingsField from "ui/settings/SettingsField";
import { Browser } from "ui/browser";

export function toFieldName(name: string): string {
    return name.replace(/\./g, "_");
}

function isClientMeta(meta: SettingMetaInfo | ClientSettingMetaInfo): meta is ClientSettingMetaInfo {
    return "internal" in meta || "scope" in meta;
}

interface Props {
    items: Item[];
    valuesMap: Map<string, string>;
    metaMap: Map<string, SettingMetaInfo> | Map<string, ClientSettingMetaInfo>;
}

export const SettingsSheetItems = ({items, valuesMap, metaMap}: Props) => (
    <>
        {items.map((item, index) => {
            switch (item.type) {
                case "chapter":
                    return (
                        <div className="chapter" key={index}>
                            <div className="title">{item.title}</div>
                            <SettingsSheetItems items={item.children} valuesMap={valuesMap} metaMap={metaMap}/>
                        </div>
                    );

                case "option":
                    const meta = metaMap.get(item.name);
                    if (meta == null) {
                        return null;
                    }
                    if (isClientMeta(meta)) {
                        const wrongScope = meta.internal
                            || (meta.scope === "desktop" && Browser.isTinyScreen())
                            || (meta.scope === "mobile" && !Browser.isTinyScreen());
                        if (wrongScope) {
                            return null;
                        }
                    }
                    const initialValue = valuesMap.get(item.name) ?? meta.defaultValue;
                    const groupClassName = item.marginBottom != null ? `mb-${item.marginBottom}` : undefined;
                    return <SettingsField key={index} name={item.name} fieldName={toFieldName(item.name)}
                                          meta={meta} initialValue={initialValue} groupClassName={groupClassName}/>

                case "component":
                    return React.createElement(item.element, {key: index});

                default:
                    return null;
            }
        })}
    </>
);
