import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Icon, msClose12, msPlayArrowFilled } from "ui/material-symbols";
import { Loading } from "ui/control/Loading";
import { formatMib } from "util/info-quantity";
import { createVideoThumbnail } from "util/video-thumbnail";
import { isImageType, isVideoType } from "util/mime-type";

interface Props {
    files: File[];
    maxSize?: number;
    onDelete: (index: number, e: React.MouseEvent) => void;
}

export function SelectedImages({files, maxSize, onDelete}: Props) {
    const [urls, setUrls] = React.useState<(string | undefined)[]>([]);
    const {t} = useTranslation();

    useEffect(() => {
        let cancelled = false;
        const objectUrls: string[] = [];

        setUrls(Array(files.length).fill(undefined));

        files.forEach((file, index) => {
            const thumbnail = !file.type || isImageType(file.type)
                ? Promise.resolve(file)
                : createVideoThumbnail(file, 100, 100);

            thumbnail.then(blob => {
                if (cancelled) {
                    return;
                }

                const url = URL.createObjectURL(blob);
                objectUrls.push(url);
                setUrls(urls => urls.toSpliced(index, 1, url));
            });
        });

        return () => {
            cancelled = true;
            objectUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [files]);

    return (
        <div className="rich-text-editor-image-list pt-0">
            {urls.length === 0 && files.length > 0 ?
                <Loading/>
            :
                files.map((file, index) => {
                    const tooLarge = maxSize != null && file.size > maxSize;
                    const title = tooLarge ?
                            t("upload-too-large", {
                                name: file.name,
                                size: formatMib(file.size),
                                maxSize: formatMib(maxSize)
                            })
                        :
                            undefined;
                    return (
                        <div key={index} className="rich-text-editor-uploaded-image" title={title}>
                            <button type="button" className="menu" onClick={e => onDelete(index, e)}>
                                <Icon icon={msClose12} size={12}/>
                            </button>
                            {tooLarge && <div className="too-large">{t("large-image")}</div>}
                            <img className="thumbnail" src={urls[index]} alt=""/>
                            {isVideoType(file.type) &&
                                <div className="play-icon"><Icon icon={msPlayArrowFilled} size={48}/></div>
                            }
                        </div>
                    );
                })
            }
        </div>
    );
}
