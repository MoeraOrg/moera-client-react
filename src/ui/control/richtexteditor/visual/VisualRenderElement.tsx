import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { DefaultElement, RenderElementProps } from 'slate-react';

import { getNodeRootPage } from "state/node/selectors";
import { getCurrentViewMediaCarte } from "state/cartes/selectors";
import { useRichTextEditorCommands } from "ui/control/richtexteditor/rich-text-editor-commands-context";
import { getImageDimensions } from "ui/control/richtexteditor/media/rich-text-image";
import { isScriptureElement } from "ui/control/richtexteditor/visual/scripture";
import { isSignificant } from "ui/control/richtexteditor/visual/scripture-html";
import OpenLink from "ui/control/richtexteditor/visual/OpenLink";
import DetailsSummary from "ui/control/richtexteditor/visual/DetailsSummary";
import PreloadedImage from "ui/posting/PreloadedImage";
import { BlockMath, InlineMath } from "ui/katex";
import { useIsTinyScreen } from "ui/hook";
import { mediaImageTagAttributes } from "util/media-images";

export default function VisualRenderElement(props: RenderElementProps) {
    const {element, attributes, children} = props;

    const tinyScreen = useIsTinyScreen();
    const rootPage = useSelector(getNodeRootPage);
    const carte = useSelector(getCurrentViewMediaCarte);
    const {formatFormula, formatImage} = useRichTextEditorCommands();
    const {t} = useTranslation();

    const onFormulaClick = () => setTimeout(() => formatFormula());

    const onImageClick = () => setTimeout(() => formatImage());

    if (isScriptureElement(element)) {
        switch (element.type) {
            case "paragraph":
                return <p {...attributes}>{children}</p>;
            case "link":
                return (
                    <span className="link" {...attributes}>
                        {children}{!tinyScreen && isSignificant(element.children) && <OpenLink href={element.href}/>}
                    </span>
                );
            case "spoiler":
                return <span className="spoiler" {...attributes}>{children}</span>;
            case "spoiler-block":
                return (
                    // @ts-ignore
                    <div className="block-border block-border-gray"  style={{"--bb-badge": `"${t("spoiler")}"`}}
                         {...attributes}>
                        {children}
                    </div>
                );
            case "mention":
                return <span className="mention" {...attributes}>{children}</span>;
            case "horizontal-rule":
                return <div {...attributes} contentEditable={false}>{children}<hr/></div>;
            case "blockquote":
                return <blockquote {...attributes}>{children}</blockquote>;
            case "list-item": {
                const listClass = (element.ordered ? "ol-" : "ul-") + element.level;
                return <div className={`list-item ${listClass}`} {...attributes}>{children}</div>;
            }
            case "heading": {
                const tagName = `h${element.level}`;
                return React.createElement(tagName, attributes, ...children);
            }
            case "iframe":
                return (
                    <div {...attributes} contentEditable={false}>
                        {children}<div dangerouslySetInnerHTML={{__html: element.code}}/>
                    </div>
                );
            case "details":
                return (
                    // @ts-ignore
                    <div className="block-border block-border-blue" style={{"--bb-badge": `"${t("fold")}"`}}
                             {...attributes}>
                        <DetailsSummary summary={element.summary} style={element.style}/>
                        {children}
                    </div>
                );
            case "code-block":
                return (
                    // @ts-ignore
                    <pre className="block-border block-border-red"  style={{"--bb-badge": `"${t("code")}"`}}
                         {...attributes}>
                        {children}
                    </pre>
                );
            case "formula":
                return (
                    <span className="formula" {...attributes} contentEditable={false} onClick={onFormulaClick}>
                        {children}<InlineMath math={element.content}/>
                    </span>
                );
            case "formula-block":
                return (
                    <div className="formula" {...attributes} contentEditable={false} onClick={onFormulaClick}>
                        {children}<BlockMath math={element.content}/>
                    </div>
                );
            case "image": {
                const {width, height} = getImageDimensions(
                    element.standardSize ?? "large", element.customWidth, element.customHeight
                );

                if (element.href != null) {
                    let style: React.CSSProperties = {};
                    if (width != null) {
                        // @ts-ignore
                        style["--width"] = `${width}px`;
                    }
                    if (height != null) {
                        // @ts-ignore
                        style["--height"] = `${height}px`;
                    }
                    return (
                        <span className="image-embedded" {...attributes} contentEditable={false}
                              onClick={onImageClick}>
                            {children}
                            <img src={element.href} width={width ?? undefined} height={height ?? undefined}
                                 alt="" style={style}/>
                        </span>
                    );
                } else if (element.mediaFile != null) {
                    const {
                        src, srcSet, sizes, width: imageWidth, height: imageHeight, alt
                    } = mediaImageTagAttributes(rootPage, element.mediaFile, carte, 900, width, height);
                    return (
                        <span className="image-attached" {...attributes} contentEditable={false}
                              onClick={onImageClick}>
                            {children}
                            <PreloadedImage src={src} srcSet={srcSet} sizes={sizes}
                                            width={imageWidth} height={imageHeight} alt={alt ?? ""}/>
                        </span>
                    );
                } else {
                    return <DefaultElement {...props}/>;
                }
            }
            case "figure-image": {
                const {width, height} = getImageDimensions(
                    element.standardSize ?? "large", element.customWidth, element.customHeight
                );

                if (element.href != null) {
                    let style: React.CSSProperties = {};
                    if (width != null) {
                        // @ts-ignore
                        style["--width"] = `${width}px`;
                    }
                    if (height != null) {
                        // @ts-ignore
                        style["--height"] = `${height}px`;
                    }
                    return (
                        <div className="figure-image-embedded" {...attributes} contentEditable={false}
                              onClick={onImageClick}>
                            {children}
                            <figure>
                                <img src={element.href} width={width ?? undefined} height={height ?? undefined}
                                     alt="" style={style}/>
                                <figcaption>{element.caption}</figcaption>
                            </figure>
                        </div>
                    );
                } else if (element.mediaFile != null) {
                    const {
                        src, srcSet, sizes, width: imageWidth, height: imageHeight, alt
                    } = mediaImageTagAttributes(rootPage, element.mediaFile, carte, 900, width, height);
                    return (
                        <div className="figure-image-attached" {...attributes} contentEditable={false}
                             onClick={onImageClick}>
                            {children}
                            <figure>
                                <PreloadedImage src={src} srcSet={srcSet} sizes={sizes}
                                                width={imageWidth} height={imageHeight} alt={alt ?? ""}/>
                                <figcaption>{element.caption}</figcaption>
                            </figure>
                        </div>
                    );
                } else {
                    return <DefaultElement {...props}/>;
                }
            }
            default:
                return <DefaultElement {...props}/>;
        }
    } else {
        return <DefaultElement {...props}/>;
    }
}
