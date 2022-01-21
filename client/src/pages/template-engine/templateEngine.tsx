// @ts-nocheck

import './templateEngine.css';

import { useEffect, useRef, useState } from 'react';
import { CreateExport } from '../../helpers/Export';
import { readFile, readFileAsDataUrl } from '../../helpers/FileReader';
import { ArrowUpward, ArrowBack, ArrowForward, ArrowDownward } from '@mui/icons-material'
import { Box, Grid, styled, Typography, AppBar, Toolbar, Card, CardMedia, CardContent, Container, Divider, List, ListItem } from '@material-ui/core';
import { Button, Checkbox, FormControl, FormControlLabel, InputLabel, Link, MenuItem, Select, Stack, TextField } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { getPayloadAsJson, getToken, isAdmin, isEmployee, isModerator } from '../../helpers/Token';
import { PageProps } from '../../@types/app';
import { HtmlData, EntryPoint, TemplateFiles, TextEntryPoint, ImageEntryPoint, ImagesData, SelectedElement } from '../../@types/templateEngine';
import Api from '../../helpers/Api';
import { mainPage } from '../fotolibrary-pagina/fotolibrary-pagina';
import { Design, Image as image } from '../../@types/general';
import kyndalogo from './kynda.png';
import download from 'downloadjs';
import Enumerable from 'linq';

const ApiInstance = new Api(getToken());

/*
Uitleg:
Hier exporteren wij een object. Dit object bevat een url wat een string is en een render property die is gekoppeld aan een
arrow function.

Dus als wij dit importeren met de naam Example1 kunnen wij render aanroepen door Example1.render() te doen.
In de render method doe je dan je react gedoe dus hoe je dat normaal zou gebruiken.
*/

const Input = styled('input')({
    display: 'none',
});

const useStylesFotoLib = makeStyles(() => ({
    icon: {
        marginRight: '20px',
    },
    cardGrid: {
        padding: '20px 0',
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%',
        width: '100%',
        height: '100%',
    },
    cardContent: {
        flexGrow: 1,
    },
}));

export const findImageByUrl = (url: string, imageFiles: Array<ImagesData>) => imageFiles.find(obj => obj['name'] === url.split('/').at(-1));

export const createSelectedElement = (element: HTMLElement, type: "image" | "text"): SelectedElement => ({ element: element, type: type });

/**
 * Creates a copy of the template and removes any keywords that are found.
 * @param template 
 * @param keyword 
 * @returns A new document with the removed keyword
 */
export const removeKeywordFromTemplate = (templateString: string, keywords: Array<string>): string => {
    // Copy document to a new document
    // TODO: Refactor
    const newDoc = new DOMParser().parseFromString(templateString, 'text/html');

    function removeKeyword(identifier: string) {
        const elements = newDoc.querySelectorAll("." + identifier);

        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove(identifier);
        }
    }

    keywords.forEach(keyword => removeKeyword(keyword))

    return new XMLSerializer().serializeToString(newDoc);
}

/** 
* Algorithm om alle "entrypoints" te vinden in een template. Een entrypoint is een html element die teksten bevat.
*/
export function getEntryPointsRecursive(files: TemplateFiles, container: HTMLElement, entryPoints: Array<EntryPoint | TextEntryPoint | ImageEntryPoint> = [], closestElementWithId: string = "") {
    const children = container.children;

    if (children.length === 0) {
        throw Error("Invalid container, does not include children.")
    }

    const entryPoint = entryPoints.filter(point => point.id === closestElementWithId)[0];

    for (let i = 0; i < children.length; i++) {
        const currentElement = children[i] as HTMLElement;
        // const currentElementStyles = getComputedStyle(currentElement);

        // Assume that we found an entrypoint and give it an appropiate ID
        if (currentElement.id === "" && currentElement.tagName.toLowerCase() === "div" && currentElement.style.length !== 0) {
            currentElement.id = "layer_" + entryPoints.length;
            currentElement.className = "layer";

            entryPoints.push({
                id: currentElement.id,
                element: currentElement,
                type: "text",
                spanClasses: [],
                pElements: [],
                spanElements: [],
            });
        }

        if (currentElement.tagName.toLowerCase() === "p") {
            entryPoint.pElements.push(currentElement as HTMLParagraphElement);
        }

        if (currentElement.tagName.toLowerCase() === "span") {
            entryPoint.spanElements.push(currentElement as HTMLSpanElement);

            if (!entryPoint.spanClasses.includes(currentElement.className)) {
                entryPoint.spanClasses.push(currentElement.className);
            }
        }

        if (currentElement.tagName.toLowerCase() === "img") {
            const imgSrc: string = currentElement.src;

            if (!imgSrc.startsWith("data")) {
                const imageObj = findImageByUrl(imgSrc, files.images);

                if (imageObj === undefined) {
                    console.error("Source is niet gevonden in de lijst met afbeeldingen.");
                }

                currentElement.src = imageObj!.data;
            }

            entryPoints.push({
                id: currentElement.parentNode.id,
                type: "image",
                element: currentElement.parentNode,
                imgElement: currentElement,
            });
        }

        if (currentElement.children.length !== 0) {
            getEntryPointsRecursive(files, currentElement, entryPoints, currentElement.id === "" ? closestElementWithId : currentElement.id);
        }
    }

    return entryPoints;
}

function TemplateEngine(props: PageProps) {
    const [editorPosition, setEditorPosition] = useState(0);
    const [designs, setDesigns] = useState([]);
    const [editorFiles, setEditorFiles] = useState<Array<HtmlData>>([]);
    const [selectedElement, setSelectedElement] = useState<SelectedElement>(null);
    const [textFieldValue, setTextFieldValue] = useState("");
    const [imageWidthValue, setImageWidthValue] = useState("");
    const [imageHeightValue, setImageHeightValue] = useState("");
    const [textWrap, setTextWrap] = useState("");
    const [textAlign, setTextAlign] = useState("");
    const [isElementEditable, setIsElementEditable] = useState(false);
    const [headerText, setHeaderText] = useState("", "");
    const [isSaved, setIsSaved] = useState(true);

    const [isDesignPending, setIsDesignPending] = useState<boolean>(true);

    const [templateName, setTemplateName] = useState("");
    const [designName, setDesignName] = useState("");

    const uploadSectionRef = useRef(null);
    const designSectionRef = useRef(null);
    const editorSectionRef = useRef(null);
    
    const textFieldRef = useRef(null);
    const wrapOptionsRef = useRef(null);
    const alignOptionsRef = useRef(null);
    const editableCheckboxRef = useRef(null);
    const editorFrameRef = useRef(null);

    // Marks an element to be editable by a customer
    const editableKeyword = 'editable';
    const editableImageKeyword = 'editable-image';
    // Marks an element to be selectable for the admin
    const selectableKeyword = 'selectable';
    const selectableImageKeyword = 'selectable-image';
    // Shows the user what element is currently selected
    const selectedKeyword = 'selected';
    const selectedImageKeyword = 'selected-image';

    const companyId = props.queryParams?.companyId;
    const templateId = props.queryParams?.templateId;
    const designId = props.queryParams?.designId;

    const isTemplateMode = companyId === undefined && templateId !== undefined && designId === undefined;
    const isDesignMode = companyId === undefined && templateId === undefined && designId !== undefined;

    const isAdminTemplateMode = isAdmin() && companyId !== undefined && templateId === undefined && designId === undefined;
    const isAdminDesignMode = isAdmin() && companyId !== undefined && templateId === undefined && designId !== undefined;

    const [fotoLibView, setFotoLibView] = useState(false);
    const [imageList, setImageList] = useState(Array<image>());
    const queryParamsObject: { queryParams: { [key: string]: string | number } } = { queryParams: { 'companyId': getPayloadAsJson()!.company } };
    const stylesFotoLib = useStylesFotoLib();

    useEffect(async () => {
        let isVerified = true;
        setImageList(image.makeImageArray((await ApiInstance.all('image')).content));

        if (isTemplateMode) {
            await ApiInstance.read('template', templateId).then(res => {
                if (res.status === "SUCCESS") {
                    setEditorFiles(res.content);
                    fetch(process.env.REACT_APP_SERVER_URL + res.content[editorPosition].Filepath)
                        .then(res => res.text())
                        .then(html => setEditorFiles([{name: "", data: html, isFetched: true}]));
                }
            })
        } else if (isAdminDesignMode || (isModerator() || isEmployee() && isDesignMode)) {
            await ApiInstance.read('design', designId).then(res => {
                if (res.status === "SUCCESS") {
                    if (res.content[editorPosition].Verified === 1) {
                        setIsDesignPending(false);
                        isVerified = false;

                        window.location = isAdmin() ? "/admin-portal" : "/user-portal";
                        return;
                    }

                    setDesigns(res.content);

                    fetch(process.env.REACT_APP_SERVER_URL + res.content[editorPosition].Filepath)
                        .then(res => res.text())
                        .then(html => setEditorFiles([{ name: "", data: html, isFetched: true }]));
                }
            })
        }

        if (textFieldRef.current !== null) {
            (textFieldRef.current as HTMLInputElement).value = textFieldValue;
        }

        if (wrapOptionsRef.current !== null) {
            (wrapOptionsRef.current as HTMLInputElement).value = textWrap;
        }

        if (alignOptionsRef.current !== null) {
            (alignOptionsRef.current as HTMLInputElement).value = textAlign;
        }

        if (editableCheckboxRef.current !== null) {
            (editableCheckboxRef.current as HTMLInputElement).checked =  selectedElement.element.classList.contains(editableKeyword);
        }

        setHeaderText(isAdminTemplateMode ? ["Template", "maken"] : isTemplateMode ? ["Design", "maken"] : isVerified ? ["Design", "Bewerken"] : ["Design", "Downloaden"]);
    }, [])

    function toggleEditorToUpload() {
        editorSectionRef.current.classList.toggle("toggleNone")
        uploadSectionRef.current.classList.toggle("toggleNone")
    }

    function toggleEditorToDesign() {
        editorSectionRef.current.classList.toggle("toggleNone")
        designSectionRef.current.classList.toggle("toggleNone")
    }

    function loadFilesHandler(e) {
        // Omdat het lezen van bestanden asynchrounous gaat, wrappen wij onze for loop in een async functie zodat wij
        // bij onze readFile statements een await mee kunnen geven.
        // Dit zorgt ervoor dat alle promises worden voldaan in sync.

        // Needs some refinement in some areas (mainly lessen the amount of for loops if possible)

        const exportFiles = e.target.files;

        if (exportFiles.length !== 0) {
            (async () => {
                let files: TemplateFiles = {
                    html: [],
                    css: [],
                    images: [],
                    js: [],
                };
    
                const createObj = (file: File, data: string) => ({
                    name: file.name,
                    data: data,
                })
    
                // TODO: Should only ready 1 template and process whenever a new template gets into the screen. Cache like behaviour.
                for (let i = 0; i < exportFiles.length; i++) {
                    const file = exportFiles[i];
    
                    if (file.type === 'text/html') {
                        files.html.push(createObj(file, await readFile(file)));
                    } else if (file.type === 'text/css') {
                        files.css.push(createObj(file, await readFile(file)));
                    } else if (file.type === 'text/javascript') {
                        files.js.push(createObj(file, await readFile(file)));
                    } else if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
                        files.images.push(createObj(file, await readFileAsDataUrl(file)));
                    } else {
                        return;
                    }
                }
    
                let fontDataLoaded = false;
    
                if (!(files['js'].some(obj => obj.name === 'FontData.js'))) {
                    alert("Geen fontdata script gevonden. Tekst kan overlappen.");
                } else {
                    fontDataLoaded = true;
                }
    
                // For every template found in the export directory
                for (let i = 0; i < files['html'].length; i++) {
                    const htmlObj = files['html'][i];
    
                    const doc = new DOMParser().parseFromString(htmlObj.data, 'text/html');
    
                    Array.from(doc.getElementsByTagName('head')[0].children).forEach(child => {
                        if (child.tagName.toLowerCase() === 'link' || (child.tagName.toLowerCase() === 'script')) child.remove();
                    })
    
                    // Add the contents of the css files as a style element to the html document
                    const styleNode = document.createElement('style');

                    // Check if css includes a background-image key with a url and change the value to be a dataurl
                    for (let i = 0; i < files.css.length; i++) {
                        let cssData: string = files.css[i].data;

                        const matches = cssData.matchAll(/background-image:url\(.*?\)/g);

                        for (const match of matches) {
                            cssData = cssData.replace(match[0], `background-image:url("${findImageByUrl(match[0].substring(match[0].indexOf("("), match[0].indexOf(")")), files.images)?.data}")`)
                        }

                        styleNode.innerHTML += cssData;
                    }

                    const imageBaseStyle = `
                            filter: brightness(0.5) drop-shadow(1px 1px 0 black) drop-shadow(-1px -1px 0 black) !important;
                            -webkit-filter: brightness(0.5) drop-shadow(1px 1px 0 black) drop-shadow(-1px -1px 0 black) !important;
                            cursor: pointer !important;
                    `;

                    const textBaseStyle = `
                            outline: 2rem solid black !important;
                            outline-radius: 0.8rem !important;
                            cursor: pointer !important;
                    `;

                    styleNode.innerHTML += `
                        .${editableKeyword} {
                            ${textBaseStyle}
                        }
                        .${editableImageKeyword} {
                            ${imageBaseStyle}
                        }
                        .${selectableKeyword}:hover {
                            ${textBaseStyle}
                        }
                        .${selectableImageKeyword}:hover {
                            ${imageBaseStyle}
                        }
                        .${selectedKeyword}:hover {
                            ${textBaseStyle}
                        }
                        .${selectedImageKeyword} {
                            ${imageBaseStyle}
                        }
                    `

                    styleNode.innerHTML.replace(/\r?\n|\r/g, '');

                    doc.getElementsByTagName('head')[0].appendChild(styleNode);
    
                    if (fontDataLoaded) {
                        const scriptNode = document.createElement('script');

                        for (let i = 0; i < files['js'].length; i++) {
                            const js = files['js'][i]['data'];

                            scriptNode.innerHTML += js.replace(js.substring(js.indexOf('document'), js.lastIndexOf(';') + 1), `
                            const head = document.getElementsByTagName('head')[0];
                            const styleNode = document.createElement('style');
                            styleNode.innerHTML = buildFontRule(nameArray[i], dataArray[i], fontStyle[i][j], fontWeight[i], fontStretch[i]);
                            head.appendChild(styleNode);`)
                        }

                        doc.getElementsByTagName('head')[0].appendChild(scriptNode);
                    }

                    const entryPoints = getEntryPointsRecursive(files, doc.getElementById('outer-wrapper'));

                    for (let i = 0; i < entryPoints.length; i++) {
                        const point = entryPoints[i];

                        if (point.type === "image") {
                            const imagePoint: ImageEntryPoint = point;

                            imagePoint.imgElement.classList.add(selectableImageKeyword);
                            continue;
                        }

                        const mergedSpan = [];

                        point.spanClasses.forEach(spanClass => {
                            const span = doc.createElement('span');
                            span.className = spanClass

                            mergedSpan.push(span);
                        })

                        point.pElements.forEach(p => p.remove());
                        
                        const node = document.createElement('script');

                        for (let j = 0; j < mergedSpan.length; j++) {
                            const span = mergedSpan[j];

                            point.spanElements.forEach(el => {
                                if (el.className === span.className) {
                                    span.innerText += el.innerText.trim() + ' ';
                                }
                            })

                            span.innerText = span.innerText.trim();

                            if (span.innerText.length === 0) {
                                continue;
                            }

                            span.id = point.id + "_span_" + j;

                            // Default styling values
                            span.style.display = "block";
                            span.style.lineHeight = 1;
                            span.style.whiteSpace = "normal";
                            span.style.textAlign = "left";
                            span.className += " " + selectableKeyword;

                            span.dataset.textLimit = span.innerText.length;

                            point.element.appendChild(span);
                        }

                        doc.getElementsByTagName('head')[0].appendChild(node);
                    }

                    files['html'][i].data = new XMLSerializer().serializeToString(doc);
                    files['html'][i].isFetched = false;
                }
    
                setEditorFiles(files['html']);
            })();
        }
    }

    function handleFileLoad(e) {
        // TODO: Make compatible for multiple templates
        const doc: Document = e.target.contentDocument;

        if (editorFiles[editorPosition].isFetched) {

            doc.querySelectorAll("." + editableKeyword).forEach(el => 
                el.onclick = (e) => {
                    setSelectedElement(createSelectedElement(e.target, "text"));
                    setTextFieldValue(e.target.innerText);
                }
            );

            doc.querySelectorAll("." + editableImageKeyword).forEach(el => 
                el.onclick = (e) => {
                    setSelectedElement(createSelectedElement(e.target, "image"));
                }
            );

            return;
        }

        doc.querySelectorAll('.' + selectableKeyword).forEach(span => {
            span.onclick = (e) => {
                setSelectedElement(createSelectedElement(e.target, "text"));
                setTextFieldValue(e.target.innerText);
                setTextWrap(e.target.style.whiteSpace);
                setTextAlign(e.target.style.textAlign);
                setIsElementEditable(e.target.classList.contains(editableKeyword))
            }
        })

        doc.querySelectorAll('.' + selectableImageKeyword).forEach(img => {
            img.onclick = (e) => {
                setSelectedElement(createSelectedElement(e.target, "image"));
                setIsElementEditable(e.target.classList.contains(editableImageKeyword))
            }
        })
    }

    function saveChangesInSession(fileIndex: number, newDocument: Document) {
        // Saves changes in current editing session
        editorFiles[fileIndex].data = new XMLSerializer().serializeToString(newDocument);
    }

    function saveChangesPermanent() {
        for (let i = 0; i < designs.length; i++) {
            const design = designs[i];

            // TODO: COMPATIBILITY FOR MULTIPLE TEMPLATES
            saveChangesInSession(i, editorFrameRef.current.contentDocument);

            const { Id, ...newDesign } = design;
            newDesign.Updated_at = new Date().toLocaleDateString('en-US');

            const fileName = design.Filepath.split('\\').at(-1);


            //TODO: voor Quinn, hij wilt niet opslaan!!!
            ApiInstance.updateFile(
                design.Name,
                fileName,
                editorFiles[editorPosition].data,
                "design",
                design.id,
                Object.values(newDesign),
                getPayloadAsJson()?.company,
                design.Template_id
            ).then(res => {
                if (res.status === "SUCCESS") {
                    setIsSaved(true);
                } else {
                    alert("Design is NIET opgeslagen.")
                    console.error(res);
                }
            });
        }
    }

    function handleTextChange(e) {
        selectedElement.element.innerText = e.target.value;
        setIsSaved(false);
        setTextFieldValue(e.target.value);
    }

    function handleImageWidthChange(e) {
        selectedElement.element.style.width = e.target.value + "px";
        setIsSaved(false);
        setImageWidthValue(e.target.value);
    }

    function handleImageHeightChange(e) {
        selectedElement.element.style.height = e.target.value + "px";
        setIsSaved(false);
        setImageHeightValue(e.target.value);
    }

    function handleWrapping(e) {
        selectedElement.element.style.whiteSpace = e.target.value;
        setIsSaved(false);
        setTextWrap(e.target.value);
    }

    function handleAlign(e) {
        selectedElement.element.style.textAlign = e.target.value;
        setIsSaved(false);
        setTextAlign(e.target.value);
    }

    function handleImageSelect(dataURL: string) {
        selectedElement.element.src = dataURL;
        setIsSaved(false);
    }

    function handleImageMoveDown() {
        setIsSaved(false);

        if (selectedElement.element.style.marginTop === '') {
            selectedElement.element.style.marginTop = "1%";
            return; 
        }
        
        selectedElement.element.style.marginTop = (parseInt(selectedElement.element.style.marginTop.replace('%', '')) + parseInt(1)).toString() + "%";
    }

    function handleImageMoveUp() {
        setIsSaved(false);

        if (selectedElement.element.style.marginTop === '') {
            selectedElement.element.style.marginTop = "-1%";
            return;
        }

        selectedElement.element.style.marginTop = (parseInt(selectedElement.element.style.marginTop.replace('%', '')) + parseInt(-1)).toString() + "%";
    }

    function handleImageMoveLeft() {
        setIsSaved(false);

        if (selectedElement.element.style.marginLeft === '') {
            selectedElement.element.style.marginLeft = "-1%";
            return;
        }

        selectedElement.element.style.marginLeft = (parseInt(selectedElement.element.style.marginLeft.replace('%', '')) + parseInt(-1)).toString() + "%";
    }

    function handleImageMoveRight() {
        setIsSaved(false);

        if (selectedElement.element.style.marginLeft === '') {
            selectedElement.element.style.marginLeft = "1%";
            return;
        }

        selectedElement.element.style.marginLeft = (parseInt(selectedElement.element.style.marginLeft.replace('%', '')) + parseInt(1)).toString() + "%";
    }

    function handleFontSizeUp() {
        setIsSaved(false);
        selectedElement.element.style.fontSize = (parseInt(window.getComputedStyle(selectedElement.element, null).getPropertyValue('font-size').replaceAll('px', '')) + parseInt(parseInt(window.getComputedStyle(selectedElement.element, null).getPropertyValue('font-size').replaceAll('px', '')) / 48) + "px");
    }

    function handleFontSizeDown() {
        setIsSaved(false);
        selectedElement.element.style.fontSize = (parseInt(window.getComputedStyle(selectedElement.element, null).getPropertyValue('font-size').replaceAll('px', '')) - parseInt(parseInt(window.getComputedStyle(selectedElement.element, null).getPropertyValue('font-size').replaceAll('px', '')) / 48) + "px");
    }

    function handleCheckboxEditable(e) {
        const list =  selectedElement.element.classList;
        const elementType = selectedElement.type;

        let keyword = editableKeyword;

        if (elementType === "image") {
            keyword = editableImageKeyword;
        }

        e.target.checked ? list.add(keyword) : list.remove(keyword);

        setIsSaved(false);
        setIsElementEditable(list.contains(keyword))
    }

    function handleAdminFormUploadTemplate(e) {
        // Not too sure about this approach, refactor later if possible
        for (let i = 0; i < editorFiles.length; i++) {
            const template = editorFiles[i];

            // TODO: COMPATIBILITY FOR MULTIPLE TEMPLATES
            saveChangesInSession(editorPosition, editorFrameRef.current.contentDocument);

            ApiInstance.createFile(
                templateName,
                `${templateName.replaceAll(' ', '_')}_${i}`, 
                removeKeywordFromTemplate(template.data, [selectableKeyword, selectableImageKeyword]),
                "template", 
                companyId
            ).then(res => {
                if (res.status === "SUCCESS") {
                    alert("Template is geupload.");
                    //toggleEditorToUpload();
                } else {
                    alert("Template is NIET geupload.");
                    //toggleEditorToUpload();
                }
                window.location = '/admin-portal';
            })
        }
    }

    // TODO: new name if possible
    async function handleCustomerFormUploadTemplateToDesign(e) {
        // Not too sure about this approach, refactor later if possible
        for (let i = 0; i < editorFiles.length; i++) {
            const template = editorFiles[i];

            // TODO: COMPATIBILITY FOR MULTIPLE TEMPLATES
            saveChangesInSession(editorPosition, editorFrameRef.current.contentDocument);

            const designNames = Enumerable.from(Design.makeDesignArray((await ApiInstance.all('design')).content)).select(d => d.Name).toArray();
            if (Enumerable.from(designNames).contains(designName)) {
                alert("Er bestaal al een design met deze naam.");
                return;
            }

            ApiInstance.createFile(
                designName,
                `${designName.replaceAll(' ', '_')}_${i}`,
                template.data, 
                "design", 
                getPayloadAsJson()?.company, 
                templateId
            ).then(res => {
                if (res.status === "FAIL") {
                    alert("Design is NIET gemaakt. Er ging iets mis.");
                    toggleEditorToDesign();
                } else if (i === editorFiles.length - 1 && res.status === "SUCCESS") {
                    alert("Design is gemaakt. U kunt het design nog aanpassen zolang het nog niet gevalideerd is.");
                    toggleEditorToDesign();
                }
            })
        }
    }

    function ActionButton(props) {
        return (
            <Button variant="contained" component="span" onClick={e => {
                if (isAdminDesignMode || (isModerator() && isDesignMode && !isSaved)) {
                    if (!window.confirm("U heeft veranderingen die nog niet zijn opgeslagen. Weet u zeker dat u wilt opslaan?")) return;
                }
                let confirmResult = window.confirm(props.confirmMessage);

                if (!confirmResult) {
                    alert("Actie geannuleerd");
                } else {
                    if (isAdminTemplateMode) {
                        toggleEditorToUpload();

                        return;
                    }

                    if ((isModerator() || isEmployee()) && isTemplateMode) {
                        toggleEditorToDesign();

                        return;
                    }

                    if (isAdminDesignMode || (isModerator() && isDesignMode)) {
                        ApiInstance.makePDF(
                            designs[editorPosition],
                            removeKeywordFromTemplate(editorFiles[editorPosition].data, [editableKeyword, editableImageKeyword]),
                            1
                        ).then(res => {
                            if (res.status === "SUCCESS") {
                                alert("Design is goedgekeurd")
                                window.location.reload();
                            } else {
                                alert("Design is NIET goedgekeurd.");
                            }
                        })
                    }
                }
            }} style={{ width: "100%" }}>
                {props.text}
            </Button>
        )
    }

    function fotosToevoegenButton(isAdmin: boolean) {
        if (!isAdmin) return;
        return (
            <>
                <Input
                    id="contained-button-file"
                    multiple
                    type="file"
                    accept='image/*'
                    onChange={async (e) => {
                        for (let i = 0; i < e.target.files!.length; i++) {
                            if (e.target.files![i].size > 20971520) {
                                alert('Uw foto is te groot!');
                            } else if (e.target.files![i].name.split('.')[0].indexOf(' ') >= 0) {
                                alert('Uw foto bevat een spatie in de naam!');
                            } else {
                                if (Object.keys(props.queryParams).length === 0 &&props.queryParams.constructor === Object
                                ) {
                                    await ApiInstance.createImage(e.target.files![i]);
                                    setImageList(image.makeImageArray((await ApiInstance.all('image')).content));
                                } else {
                                    await ApiInstance.createImage(
                                        e.target.files![i],
                                        isAdmin ? typeof (props.queryParams.companyId) === 'string' ? parseInt(props.queryParams.companyId) : props.queryParams.companyId : parseInt(getPayloadAsJson()!.company)
                                    );
                                    setImageList(image.makeImageArray((await ApiInstance.all('image')).content));
                                }
                            }
                        }
                    }}
                />
                <label htmlFor="contained-button-file">
                    <Button variant="contained" component="span" color="primary">
                        Foto's toevoegen
                    </Button>
                </label>
            </>
        );
        
    }

    function EditorTextSize() {
        return (
            <div>
                <Button variant="contained" style={{ textAlign: "center", padding: "0px", fontSize: "15px", marginRight: "10px" }} onClick={() => { handleFontSizeUp(); }}>
                    A^
                </Button>
                <Button variant="contained" style={{ textAlign: "center", padding: "0px", fontSize: "15px" }} onClick={() => { handleFontSizeDown(); }}>
                    a˅
                </Button>
            </div>
        )
    }

    function EditorTextWrap() {
        return (
            <FormControl style={{ width: "100%" }}>
                <InputLabel id="templateEditorSelectWrapLabel">Tekstomloop</InputLabel>
                <Select
                    id="templateEditorSelectWrap"
                    labelId='templateEditorSelectWrapLabel'
                    label="Wrap"
                    value={textWrap}
                    onChange={handleWrapping}
                    ref={wrapOptionsRef}
                >
                    <MenuItem value={"normal"}>Tekstomloop</MenuItem>
                    <MenuItem value={"nowrap"}>Geen tekstomloop</MenuItem>
                </Select>
            </FormControl>
        )
    }

    function EditorTextAlign() {
        return (
            <FormControl style={{ width: "100%" }}>
                <InputLabel id="templateEditorSelectAlignLabel">Tekstuitlijning</InputLabel>
                <Select
                    id="templateEditorSelectAlign"
                    labelId='templateEditorSelectAlignLabel'
                    label="Align"
                    value={textAlign}
                    onChange={handleAlign}
                    ref={alignOptionsRef}
                >
                    <MenuItem value={"left"}>Links</MenuItem>
                    <MenuItem value={"center"}>Midden</MenuItem>
                    <MenuItem value={"right"}>Richts</MenuItem>
                </Select>
            </FormControl>
        )
    }

    function imagesEmpty(images: Array<image>) {
        let userCompany;
        if (isAdmin()) {
            userCompany = props.queryParams.companyId;
        }
        else {
            userCompany = getPayloadAsJson()!.company;
        }
        for (let i = 0; i < images.length; i++) {
            const imageId = images[i].Company_Id;
            if (userCompany == imageId) {
                return false;
            }
        }
        return true;
    }

    function retrieveImageName(filepath: string) {
        const imageFilePath = filepath;
        const imagePathArray = imageFilePath.split('\\');
        const imagePathName = imagePathArray[imagePathArray.length - 1];
        const imageName = imagePathName.split('.');
        return imageName;
    }

    function imageOnHover(id: number, isAdmin: boolean, select: boolean) {
        const imgId = 'img' + id;

        const buttonId = 'btn' + id;
        const buttonDeleteId = 'btnDelete' + id;
        document.getElementById(imgId)!.style.filter = 'blur(4px)';
        document.getElementById(imgId)!.style.transition = '1s';

        if (select) {
            document.getElementById(buttonId)!.style.transition = '1s';
            document.getElementById(buttonId)!.style.opacity = '1';
            document.getElementById(buttonId)!.style.top =
                String(parseInt(document.getElementById(imgId)!.style.height) / 1.5) + 'px';
            document.getElementById(buttonId)!.style.left =
                String(parseInt(document.getElementById(imgId)!.style.width) / 7) + 'px';
        }

        if (isAdmin) {
            document.getElementById(buttonDeleteId)!.style.transition = '1s';
            document.getElementById(buttonDeleteId)!.style.opacity = '1';
            document.getElementById(buttonDeleteId)!.style.top =
                String(parseInt(document.getElementById(imgId)!.style.height) / 1.5) + 'px';
            document.getElementById(buttonDeleteId)!.style.left =
                String(parseInt(document.getElementById(imgId)!.style.width) / 7) + 'px';
        }
    }

    function imageLeave(id: number, isAdmin: boolean, select: boolean) {
        const imgId = 'img' + id;
        const buttonId = 'btn' + id;
        if (isAdmin) {
            const buttonDeleteId = 'btnDelete' + id;
            document.getElementById(buttonDeleteId)!.style.opacity = '0';
        }
        else document.getElementById(imgId)!.style.filter = 'none';
        if (select) document.getElementById(buttonId)!.style.opacity = '0';
        document.getElementById(imgId)!.style.filter = 'none';
    }

    async function selectedPicture(e: Event, type: string, id: number) {
        e.preventDefault();

        if (type === 'select') {
            const image: Image = Enumerable.from(imageList).where(i => i.Id === id).toArray()[0];
            fetch(process.env.REACT_APP_SERVER_URL + image.Filepath)
            .then(response => response.blob())
            .then(data => {
                readFileAsDataUrl(new File([data], "name")).then(result => {
                    handleImageSelect(result);
                    setFotoLibView(false);
                    alert('Uw foto is geselecteerd!');
                });
            });
        } else {
            ApiInstance.removeImage(id).then(() => window.location.reload());
        }
    }

    function EditorMarkAsEditable() {
        return (
            <FormControlLabel
                label="Maak bewerkbaar voor klant"
                control={
                    <Checkbox
                        checked={isElementEditable}
                        onChange={handleCheckboxEditable}
                        ref={editableCheckboxRef}
                    />
                }
            />
        )
    }

    return (
        <>
            <AppBar position="relative" style={{ background: 'white' }}>
                <Toolbar>
                    <img
                        src={kyndalogo}
                        alt="kynda logo"
                        width="90"
                        height="30"
                        style={{ marginRight: '20px' }}
                    />
                    <Typography variant="h5" style={{ color: 'black' }}>
                        {headerText[0]}
                    </Typography>
                    <Typography variant="h5" style={{ color: 'black', marginLeft: '6px' }}>
                        {headerText[1]}
                    </Typography>
                    <Grid container spacing={2} justifyContent="flex-end">
                        <Grid item>{fotosToevoegenButton((isAdmin() || isModerator()) && fotoLibView)}</Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    document.cookie = document.cookie.substring(
                                        document.cookie.indexOf('token='),
                                        6
                                    );
                                    window.location.replace('/');
                                }}
                            >
                                Uitloggen
                            </Button>
                        </Grid>
                        <Grid item>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            {
                isAdminTemplateMode ?
                    <Box ref={uploadSectionRef} className='toggleNone' sx={{ flexDirection: 'column', justifyContent: 'center', margin: '30px 30% 0 30%'}}>
                        <h1>Template uploaden</h1>
                        <TextField fullWidth label="Naam" id="fullWidth" style={{ marginTop: "20px" }} onChange={e => setTemplateName(e.target.value)} />
                        <Button variant="contained" style={{ marginTop: "20px" }} onClick={handleAdminFormUploadTemplate}>Upload template</Button>
                        <Button variant="contained" color='error' style={{ marginTop: "20px", marginLeft: "20px" }} onClick={e => {
                            toggleEditorToUpload();
                    }}>Annuleer</Button>
                </Box>
                :
                <Box ref={designSectionRef} className='toggleNone' sx={{ flexDirection: 'column', justifyContent: 'center', margin: '30px 30% 0 30%' }}>
                    <h1>Template naar design</h1>
                    <TextField fullWidth label="Naam" id="fullWidth" style={{ marginTop: "20px" }} onChange={e => setDesignName(e.target.value)} />
                    <Button variant="contained" style={{ marginTop: "20px" }} onClick={handleCustomerFormUploadTemplateToDesign}>Maak design</Button>
                    <Button variant="contained" color='error' style={{ marginTop: "20px", marginLeft: "20px" }} onClick={e => {
                        toggleEditorToDesign();
                    }}>Annuleer</Button>
                </Box>
            }
            <Grid ref={editorSectionRef} container style={{ overflow: "hidden"}}>
                <Grid item xs={2} style={{ height: "93.2vh" }}>
                    <Box
                        component={Grid}
                        container
                        boxShadow={3}
                        style={{ height: "inherit" }}
                    >
                        <Stack spacing={2} alignItems={"center"} style={{ width: "100%", margin: "20px 10px 0 10px" }}>
                            {
                                isAdminTemplateMode && (
                                    <label htmlFor="contained-button-file" style={{ width: "100%" }}>
                                        <Input
                                            id="contained-button-file"
                                            multiple
                                            webkitdirectory="true"
                                            directory="true"
                                            type="file"
                                            onChange={loadFilesHandler}
                                        />
                                        <Button variant="contained" component="span" style={{ width: "100%", textAlign: "center" }}>
                                            Exportbestanden laden
                                        </Button>
                                    </label>
                                )
                            }
                            {
                                editorFiles.length > 1 &&
                                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                    <Button 
                                        variant="contained" 
                                        component="span" 
                                        onClick={() => {
                                            saveChangesInSession(editorPosition, editorFrameRef.current.contentDocument);
                                            setEditorPosition(editorPosition - 1);
                                        }} 
                                        style={{ width: "40%" }}
                                        disabled={ editorPosition <= 0 }
                                    >Vorige</Button>
                                    <Button 
                                        variant="contained" 
                                        component="span" 
                                        onClick={() => {
                                            saveChangesInSession(editorPosition, editorFrameRef.current.contentDocument);
                                            setEditorPosition(editorPosition + 1);
                                        }} 
                                        style={{ width: "40%" }}
                                        disabled={editorPosition >= editorFiles.length - 1}
                                    >Volgende</Button>
                                </div>
                            }
                            {
                                (isAdminTemplateMode || (isModerator() || isEmployee() && (isTemplateMode || isDesignMode))) && selectedElement !== null && selectedElement.type === "text" &&
                                <>
                                    <TextField
                                        id="templateEditorTextField"
                                        label="Type text"
                                        multiline
                                        rows={4}
                                        variant="filled"
                                        value={textFieldValue}
                                        onChange={handleTextChange}
                                        style={{ width: "100%" }}
                                        ref={textFieldRef}
                                        // inputProps={{ maxLength: parseInt(selectedElement.element.dataset.textLimit) }}
                                    />
                                    <EditorTextSize />
                                    <EditorTextWrap />
                                    <EditorTextAlign />
                                </>
                            }
                            {
                                (isAdminTemplateMode || (isModerator() || isEmployee() && (isTemplateMode || isDesignMode))) && selectedElement !== null && selectedElement.type === "image" &&
                                <>
                                    <Button variant="contained" style={{ textAlign: "center", width: "100%" }} onClick={() => { setFotoLibView(!fotoLibView) }}>
                                        afbeelding selecteren
                                    </Button>
                                    <div style={{ width: "100%", display: "flex", alignContent: "flex-start" }}>
                                        <div style={{ display: "flex", flexDirection: "column", width: "40%" }}><TextField
                                            label="Breedte"
                                            variant="filled"
                                            value={imageWidthValue}
                                            onChange={handleImageWidthChange}
                                            style={{ width: "100%", marginBottom: "10px" }}
                                        />
                                            <TextField
                                                label="Hoogte"
                                                variant="filled"
                                                value={imageHeightValue}
                                                onChange={handleImageHeightChange}
                                                style={{ width: "100%" }}
                                            />
                                        </div>
                                        <div style={{ width: "60%" }}>
                                            <Typography variant="body2" style={{marginBottom: "5px", marginLeft: "15px"}}>Afbeelding verplaatsen</Typography>
                                            <Button variant="contained" size="small" style={{ textAlign: "center", minWidth: "0px", Width: "20px", marginLeft: "52px" }} onClick={() => { handleImageMoveUp(); }}>
                                                <ArrowUpward style={{ fontSize: "15px" }} />
                                            </Button>
                                            <div style={{marginLeft: "20px"}}><Button variant="contained" size="small" style={{ textAlign: "center", minWidth: "0px", Width: "20px" }} onClick={() => { handleImageMoveLeft(); }}>
                                                <ArrowBack style={{ fontSize: "15px" }} />
                                            </Button>
                                                <Button variant="contained" size="small" style={{ textAlign: "center", minWidth: "0px", Width: "20px", marginLeft: "30px" }} onClick={() => { handleImageMoveRight(); }}>
                                                    <ArrowForward style={{ fontSize: "15px" }} />
                                                </Button>
                                            </div>
                                            <Button variant="contained" size="small" style={{ textAlign: "center", minWidth: "0px", Width: "20px", marginLeft: "52px" }} onClick={() => { handleImageMoveDown(); }}>
                                                <ArrowDownward style={{ fontSize: "15px" }} />
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            }
                            {
                                isAdminTemplateMode && selectedElement !== null &&
                                <EditorMarkAsEditable />
                            }
                            {
                                editorFiles.length > 0 && isAdminTemplateMode && 
                                <ActionButton text="Upload" confirmMessage="Weet u zeker dat u de template wilt uploaden?" />
                            }
                            {
                                editorFiles.length > 0 && (isModerator() || isEmployee()) && isTemplateMode && 
                                <ActionButton text="Maak design" confirmMessage="Weet u zeker dat u een design wilt maken?" />
                            }
                            {
                                editorFiles.length > 0 && isAdminDesignMode || (isModerator() && isDesignMode) && isDesignPending &&
                                <ActionButton text="Valideer" confirmMessage="Weet u zeker dat u de design wilt goedkeuren?" />
                            }
                            {
                                isSaved !== null && isDesignMode && (isModerator() || isEmployee()) &&
                                <Button variant="contained" component="span" disabled={isSaved} color={isSaved ? "primary" : "error"} style={{ width: "100%", textAlign: "center" }} onClick={e => {
                                    saveChangesPermanent();
                                }}>{isSaved ? "Opgeslagen" : "Klik om op te slaan"}</Button>
                            }
                            <Button variant="contained" component="span" style={{ width: "100%", textAlign: "center" }} onClick={e => {
                                if (!isSaved) {
                                    if (!window.confirm("U heeft veranderingen die nog niet zijn opgeslagen. Weet u zeker dat u wilt opslaan?")) return;
                                }
                                window.location = isAdmin() ? "/admin-portal" : "/user-portal";
                            }}>Terug naar {isAdmin() ? "admin portaal" : "user portaal"}</Button>
                        </Stack>
                    </Box>
                </Grid>
                <Grid item xs={true}>
                    {editorFiles.length > 0 && editorPosition >= 0 && editorPosition <= editorFiles.length - 1 && (isAdminTemplateMode || isTemplateMode || isDesignMode) &&
                        <iframe onLoad={handleFileLoad}
                            title="templateViewer"
                            srcDoc={editorFiles[editorPosition]?.data}
                            style={{ height: "100%", width: "100%", display: fotoLibView ? "none" : "block" }}
                            ref={editorFrameRef}
                            id="IframeDoc"
                        ></iframe>
                    }
                    {selectedElement !== null && selectedElement.type === "image" && fotoLibView &&
                        <div>
                            <Container maxWidth="md" className={stylesFotoLib.cardGrid}>
                                <Grid container spacing={4}>
                                    {imagesEmpty(imageList) ? (
                                        <Typography gutterBottom variant="h6" align="center">
                                            Geen foto's
                                        </Typography>
                                    ) : (
                                        imageList.map((image, index) => {
                                            const initialImageURL =
                                                process.env.REACT_APP_SERVER_URL + image.Filepath;
                                            const actualImageURL = initialImageURL.replace(/\\/g, '/');
                                            const imageName = retrieveImageName(image.Filepath);
                                            const propsFotolib = getPayloadAsJson()!.type === "Admin" ? props : queryParamsObject;
                                            let token = getPayloadAsJson();
                                            let userCompany;
                                            if (Object.keys(propsFotolib.queryParams).length === 0 && propsFotolib.queryParams.constructor === Object) {
                                                userCompany = token!.company;
                                            } else {
                                                userCompany = propsFotolib.queryParams.companyId;
                                            }
                                            if (userCompany == image.Company_Id) {
                                                if (!isEmployee()) {
                                                    return (
                                                        <Grid item xs={12} sm={6} md={4} key={index}>
                                                            <Card className={stylesFotoLib.card}>
                                                                <Button
                                                                    id={'btn' + index}
                                                                    variant="contained"
                                                                    style={{ color: 'white', backgroundColor: 'blue', opacity: 0 }}
                                                                    onMouseEnter={() =>
                                                                        imageOnHover(index, !isEmployee(), true)
                                                                    }
                                                                    onMouseLeave={() =>
                                                                        imageLeave(index, !isEmployee(), true)
                                                                    }
                                                                    onClick={(e) =>
                                                                        selectedPicture(
                                                                            e, 'select',
                                                                            image.Id
                                                                        )
                                                                    }
                                                                >
                                                                    {'Selecteren'}
                                                                </Button>
                                                                <CardMedia
                                                                    id={'img' + index}
                                                                    className={stylesFotoLib.cardMedia}
                                                                    title={imageName[0]}
                                                                    image={actualImageURL}
                                                                    onMouseEnter={() =>
                                                                        imageOnHover(index, !isEmployee(), true)
                                                                    }
                                                                    onMouseLeave={() =>
                                                                        imageLeave(index, !isEmployee(), true)
                                                                    }
                                                                />
                                                                <Button
                                                                    id={'btnDelete' + index}
                                                                    variant="contained"
                                                                    style={{ color: 'white', backgroundColor: 'red', opacity: 0 }}
                                                                    onMouseEnter={() =>
                                                                        imageOnHover(index, !isEmployee(), true)
                                                                    }
                                                                    onMouseLeave={() =>
                                                                        imageLeave(index, !isEmployee(), true)
                                                                    }
                                                                    onClick={(e) =>
                                                                        selectedPicture(
                                                                            e,
                                                                            'delete',
                                                                            image.Id
                                                                        )
                                                                    }
                                                                >
                                                                    {'Verwijderen'}
                                                                </Button>
                                                                <CardContent className={stylesFotoLib.cardContent}>
                                                                    <Typography
                                                                        gutterBottom
                                                                        variant="h6"
                                                                        align="center"
                                                                    >
                                                                        {imageName[0]}
                                                                    </Typography>
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>
                                                    );
                                                }
                                                else {
                                                    return (
                                                        <Grid item xs={12} sm={6} md={4} key={index}>
                                                            <Card className={stylesFotoLib.card}>
                                                                <Button
                                                                    id={'btn' + index}
                                                                    variant="contained"
                                                                    style={{ color: 'white', backgroundColor: 'blue', opacity: 0 }}
                                                                    onMouseEnter={() =>
                                                                        imageOnHover(index, !isEmployee(), true)
                                                                    }
                                                                    onMouseLeave={() =>
                                                                        imageLeave(index, !isEmployee(), true)
                                                                    }
                                                                    onClick={(e) =>
                                                                        selectedPicture(
                                                                            e, 'select',
                                                                            image.Id
                                                                        )
                                                                    }
                                                                >
                                                                    {'Selecteren'}
                                                                </Button>
                                                                <CardMedia
                                                                    id={'img' + index}
                                                                    className={stylesFotoLib.cardMedia}
                                                                    title={imageName[0]}
                                                                    image={actualImageURL}
                                                                    onMouseEnter={() =>
                                                                        imageOnHover(index, !isEmployee(), true)
                                                                    }
                                                                    onMouseLeave={() =>
                                                                        imageLeave(index, !isEmployee(), true)
                                                                    }
                                                                />
                                                                <CardContent className={stylesFotoLib.cardContent}>
                                                                    <Typography
                                                                        gutterBottom
                                                                        variant="h6"
                                                                        align="center"
                                                                    >
                                                                        {imageName[0]}
                                                                    </Typography>
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>
                                                    );
                                                }
                                            }
                                        })
                                    )}
                                </Grid>
                            </Container>
                        </div>
                    }
                    {editorFiles.length <= 0 &&
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100vh",
                        }}>Geen template geselecteerd</div>
                    }
                </Grid>
            </Grid>
        </>
    )
}

export default CreateExport('/editor', TemplateEngine);
