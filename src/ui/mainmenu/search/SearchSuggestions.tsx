import React, { ForwardedRef, forwardRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import { getHomeOwnerAvatar, getHomeOwnerName } from "state/home/selectors";
import Jump from "ui/navigation/Jump";
import { Icon, msCancel, msHistory, msSearch } from "ui/material-symbols";
import { NameSuggestion } from "ui/control";
import { NameListItem } from "util/names-list";
import { ut } from "util/url";
import "./SearchSuggestions.css";

export type SearchListItem = {type: "name"} & NameListItem | {type: "search"} | {type: "history", query: string};

interface Props {
    query: string | null;
    searchList: SearchListItem[];
    selectedIndex: number;
    handleClick: (index: number) => () => void;
    onHistoryDelete: (index: number) => (event: React.MouseEvent) => void;
    visible?: boolean;
}

function SearchSuggestions(
    {query, searchList, selectedIndex, handleClick, onHistoryDelete, visible}: Props,
    ref: ForwardedRef<HTMLDivElement>
) {
    const homeName = useSelector(getHomeOwnerName);
    const homeAvatar = useSelector(getHomeOwnerAvatar);
    const {t} = useTranslation();

    return (
        <div className={cx("name-select", {"d-none": !visible})} ref={ref}>
            {searchList.map((item, index) =>
                <React.Fragment key={index}>
                    {item.type === "history" &&
                        <>
                            <Jump
                                data-index={index}
                                className={cx("search-item", "item", {"selected": selectedIndex === index})}
                                href={ut`/search?query=${item.query}`}
                                onNear={handleClick(index)} onFar={handleClick(index)}
                            >
                                <div className="icon-cell">
                                    <Icon icon={msHistory} size={20}/>
                                </div>
                                <div className="body">
                                    {item.query}
                                </div>
                                <div className="icon-cell" title={t("delete")} onClick={onHistoryDelete(index)}>
                                    <Icon icon={msCancel} size={16}/>
                                </div>
                            </Jump>
                            {(index + 1 < searchList.length && searchList[index + 1].type === "name") && <hr/>}
                        </>
                    }
                    {item.type === "name" &&
                        <NameSuggestion
                            key={index}
                            className={cx("item", {"selected": index === selectedIndex})}
                            index={index}
                            nodeName={item.nodeName}
                            fullName={item.fullName}
                            avatar={item.nodeName !== homeName ? item.avatar : homeAvatar}
                            onClick={handleClick}
                        />
                    }
                    {item.type === "search" &&
                        <>
                            {searchList.length > 1 && <hr/>}
                            <Jump
                                data-index={index}
                                className={cx("search-item", "item", {"selected": selectedIndex === index})}
                                href={ut`/search?query=${query}`}
                                onNear={handleClick(index)} onFar={handleClick(index)}
                            >
                                <div className="icon-cell">
                                    <Icon icon={msSearch} size={20}/>
                                </div>
                                <div className="body">
                                    {t("search")}: {query}
                                </div>
                            </Jump>
                        </>
                    }
                </React.Fragment>
            )}
        </div>
    );
}

export default forwardRef(SearchSuggestions);
