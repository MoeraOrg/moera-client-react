import React, { useEffect } from 'react';

import { Icon, msClose } from "ui/material-symbols";
import { Loading } from "ui/control/Loading";

interface Props {
    files: File[];
    onDelete: (index: number, e: React.MouseEvent) => void;
}

export function SelectedImages({files, onDelete}: Props) {
    const [filesData, setFilesData] = React.useState<string[]>([]);

    useEffect(() => {
        Promise.all(files.map(readFileAsUrl)).then(setFilesData);
    }, [files]);

    return (
        <div className="rich-text-editor-image-list pt-0">
            {filesData.length === 0 && files.length > 0 ?
                <Loading/>
            :
                filesData.map((fileData, index) =>
                    <div key={index} className="rich-text-editor-uploaded-image">
                        <button type="button" className="menu" onClick={e => onDelete(index, e)}>
                            <Icon icon={msClose} width={12} height={12}/>
                        </button>
                        <img className="thumbnail" src={fileData} alt=""/>
                    </div>
                )
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
