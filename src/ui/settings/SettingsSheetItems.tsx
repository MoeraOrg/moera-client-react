import React from 'react';
import { useTranslation } from 'react-i18next';

import { CLIENT_SETTINGS_PREFIX, ClientSettingMetaInfo, SettingMetaInfo } from "api";
import { useIsTinyScreen } from "ui/hook";
import { Item } from "ui/settings/settings-menu";
import SettingsField from "ui/settings/SettingsField";

export function toFieldName(name: string): string {
    return name.replace(/\./g, "_");
}

export function toTitleName(name: string): string {
    const clientSetting = name.startsWith(CLIENT_SETTINGS_PREFIX);
    let settingName = clientSetting ? name.substring(CLIENT_SETTINGS_PREFIX.length) : name;
    settingName = settingName.replace(/\./g, "_");
    return clientSetting ? `setting.${CLIENT_SETTINGS_PREFIX}${settingName}` : `setting.node.${settingName}`;
}

function isClientMeta(meta: SettingMetaInfo | ClientSettingMetaInfo): meta is ClientSettingMetaInfo {
    return "internal" in meta || "scope" in meta;
}

interface Props {
    items: Item[];
    valuesMap: Map<string, string | null>;
    metaMap: Map<string, SettingMetaInfo> | Map<string, ClientSettingMetaInfo>;
}

export function SettingsSheetItems({items, valuesMap, metaMap}: Props) {
    const tinyScreen = useIsTinyScreen();
    const {t} = useTranslation();

    return (
        <>
            {items.map((item, index) => {
                switch (item.type) {
                    case "chapter":
                        return (
                            <div className="chapter" key={index}>
                                <div className="title">
                                    {t(`setting.chapter.${item.name}`)}
                                    {item.controls != null
                                        ? React.createElement(item.controls, item.controlsParameters)
                                        : null}
                                    {item.description != null &&
                                        <div className="description">{item.description}</div>
                                    }
                                </div>
                                <SettingsSheetItems items={item.children} valuesMap={valuesMap} metaMap={metaMap}/>
                            </div>
                        );

                    case "option": {
                        const meta = metaMap.get(item.name);
                        if (meta == null) {
                            return null;
                        }
                        if (isClientMeta(meta)) {
                            const wrongScope = meta.internal
                                || (meta.scope === "desktop" && tinyScreen)
                                || (meta.scope === "mobile" && !tinyScreen);
                            if (wrongScope) {
                                return null;
                            }
                        }
                        const initialValue = valuesMap.get(item.name) ?? meta.defaultValue;
                        const groupClassName = item.marginBottom != null ? `mb-${item.marginBottom}` : undefined;
                        return <SettingsField key={index} name={item.name} fieldName={toFieldName(item.name)}
                                              titleName={toTitleName(item.name)} meta={meta}
                                              initialValue={initialValue} groupClassName={groupClassName}/>
                    }

                    case "component":
                        return React.createElement(item.element, {key: index});

                    case "text": {
                        const className = item.marginBottom != null ? `mb-${item.marginBottom}` : undefined;
                        return <div className={className}>{item.title}</div>
                    }

                    default:
                        return null;
                }
            })}
        </>
    );
}
