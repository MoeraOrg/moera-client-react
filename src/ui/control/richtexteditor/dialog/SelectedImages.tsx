import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Icon, msClose } from "ui/material-symbols";
import { Loading } from "ui/control/Loading";
import { formatMib } from "util/info-quantity";

interface Props {
    files: File[];
    maxSize?: number;
    onDelete: (index: number, e: React.MouseEvent) => void;
}

export function SelectedImages({files, maxSize, onDelete}: Props) {
    const [filesData, setFilesData] = React.useState<FileData[]>([]);
    const {t} = useTranslation();

    useEffect(() => {
        Promise.all(files.map(readFileAsUrl)).then(urls =>
            setFilesData(urls.map((url, index) => (
                {url, tooLarge: maxSize != null && files[index].size > maxSize}
            )))
        )
    }, [files, maxSize]);

    return (
        <div className="rich-text-editor-image-list pt-0">
            {filesData.length === 0 && files.length > 0 ?
                <Loading/>
            :
                filesData.map((fileData, index) => {
                    const title = fileData.tooLarge ?
                            t("upload-too-large", {
                                name: files[index].name,
                                size: formatMib(files[index].size),
                                maxSize: formatMib(maxSize!)
                            })
                        :
                            undefined;
                    return (
                        <div key={index} className="rich-text-editor-uploaded-image" title={title}>
                            <button type="button" className="menu" onClick={e => onDelete(index, e)}>
                                <Icon icon={msClose} size={12}/>
                            </button>
                            {fileData.tooLarge && <div className="too-large">{t("large-image")}</div>}
                            <img className="thumbnail" src={fileData.url} alt=""/>
                        </div>
                    );
                })
            }
        </div>
    );
}

function readFileAsUrl(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const blob = new Blob([reader.result as ArrayBuffer], {type: file.type});
            resolve(URL.createObjectURL(blob));
        }
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
}

interface FileData {
    url: string;
    tooLarge: boolean;
}
