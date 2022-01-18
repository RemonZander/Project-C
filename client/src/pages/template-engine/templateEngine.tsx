// @ts-nocheck

import './templateEngine.css';

import { useEffect, useRef, useState } from 'react';
import { CreateExport } from '../../helpers/Export';
import { readFile, readFileAsDataUrl } from '../../helpers/FileReader';
import { Box, Grid, styled, Typography, AppBar, Toolbar } from '@material-ui/core';
import { Button, Checkbox, FormControl, FormControlLabel, InputLabel, Link, MenuItem, Select, Stack, TextField } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { getPayloadAsJson, getToken, isAdmin, isEmployee, isModerator } from '../../helpers/Token';
import { PageProps } from '../../@types/app';
import { HtmlData, EntryPoint, TemplateFiles, TextEntryPoint, ImageEntryPoint, ImagesData, SelectedElement } from '../../@types/templateEngine';
import Api from '../../helpers/Api';
import { mainPage } from '../fotolibrary-pagina/fotolibrary-pagina';
import { Image as image } from '../../@types/general';
import kyndalogo from './kynda.png';
import download from 'downloadjs';

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
    const [templatePos, setTemplatePos] = useState(0);
    const [designs, setDesigns] = useState([]);
    const [templateFiles, setTemplateFiles] = useState<Array<HtmlData>>([]);
    const [selectedElement, setSelectedElement] = useState<SelectedElement>(null);
    const [textFieldValue, setTextFieldValue] = useState("");
    const [textWrap, setTextWrap] = useState("");
    const [textAlign, setTextAlign] = useState("");
    const [isElementEditable, setIsElementEditable] = useState(false);
    const [headerText, setHeaderText] = useState("", "");

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

    const loadImages = async () => {
        setImageList(image.makeImageArray((await ApiInstance.all('image')).content));
    };

    useEffect(async () => {
        let isVerified = true;
        loadImages();

        if (isTemplateMode) {
            await ApiInstance.read('template', templateId).then(res => {
                if (res.status === "SUCCESS") {
                    setTemplateFiles(res.content);
                    fetch(process.env.REACT_APP_SERVER_URL + res.content[templatePos].Filepath)
                        .then(res => res.text())
                        .then(html => setTemplateFiles([{name: "", data: html, isFetched: true}]));
                }
            })
        } else if (isAdminDesignMode || (isModerator() || isEmployee() && isDesignMode)) {
            await ApiInstance.read('design', designId).then(res => {
                if (res.status === "SUCCESS") {
                    if (res.content[templatePos].Verified === 1) {
                        setIsDesignPending(false);
                        isVerified = false;
                    }

                    setDesigns(res.content);
                    fetch(process.env.REACT_APP_SERVER_URL + res.content[templatePos].Filepath)
                        .then(res => res.text())
                        .then(html => setTemplateFiles([{ name: "", data: html, isFetched: true }]));
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
    
                setTemplateFiles(files['html']);
            })();
        }
    }

    function handleTemplateLoad(e) {
        // TODO: Make compatible for multiple templates
        const doc: Document = e.target.contentDocument;

        if (templateFiles[templatePos].isFetched) {

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

    function handleTextChange(e) {
        selectedElement.element.innerText = e.target.value;
        setTextFieldValue(e.target.value);
    }

    function handleWrapping(e) {
        selectedElement.element.style.whiteSpace = e.target.value;
        setTextWrap(e.target.value);
    }

    function handleAlign(e) {
        selectedElement.element.style.textAlign = e.target.value;
        setTextAlign(e.target.value);
    }

    function handleFontSizeUp(e) {
        selectedElement.element.style.fontSize = (parseInt(window.getComputedStyle(selectedElement.element, null).getPropertyValue('font-size').replaceAll('px', '')) + parseInt(parseInt(window.getComputedStyle(selectedElement.element, null).getPropertyValue('font-size').replaceAll('px', '')) / 48) + "px");
    }

    function handleFontSizeDown(e) {
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

        setIsElementEditable(list.contains(keyword))
    }

    function handleAdminFormUploadTemplate(e) {
        // Not too sure about this approach, refactor later if possible
        for (let i = 0; i < templateFiles.length; i++) {
            const template = templateFiles[i];

            template.data = new XMLSerializer().serializeToString(editorFrameRef.current.contentDocument);

            const newDoc = new DOMParser().parseFromString(template.data, 'text/html');
            const selectableElements = newDoc.querySelectorAll("." + selectableKeyword);

            for (let i = 0; i < selectableElements.length; i++) {
                selectableElements[i].classList.remove(selectableKeyword);
            }

            ApiInstance.createFile(templateName, `${templateName.replaceAll(' ', '_')}`, new XMLSerializer().serializeToString(newDoc), "template", companyId).then(res => {
                if (res.status === "SUCCESS") {
                    alert("Template is geupload.");
                    toggleEditorToUpload();
                } else {
                    alert("Template is NIET geupload.");
                    toggleEditorToUpload();
                }
            })
        }
    }

    // TODO: new name if possible
    function handleCustomerFormUploadTemplateToDesign(e) {
        // Not too sure about this approach, refactor later if possible
        for (let i = 0; i < templateFiles.length; i++) {
            const template = templateFiles[i];
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
                } else if (i === templateFiles.length - 1 && res.status === "SUCCESS") {
                    alert("Design is gemaakt. U kunt het design nog aanpassen zolang het nog niet gevalideerd is.");
                    toggleEditorToDesign();
                }
            })
        }
    }

    function ActionButton(props) {
        return (
            <Button variant="contained" component="span" onClick={e => {
                let confirmResult = window.confirm(props.confirmMessage);

                if (!confirmResult) {
                    alert("Actie geannuleerd");
                } else {
                    if (isAdminTemplateMode) {
                        toggleEditorToUpload();

                        return;
                    }

                    if (isModerator() && isEmployee() && isTemplateMode) {
                        toggleEditorToDesign();

                        return;
                    }

                    if (isAdminDesignMode || (isModerator() && isDesignMode)) {
                        designs.forEach(design => {
                            const { Id, ...newDesign} = design;
                            newDesign.Updated_at = new Date().toLocaleDateString('en-US');
                            newDesign.Verified = 1;

                            const newDoc = new DOMParser().parseFromString(new XMLSerializer().serializeToString(editorFrameRef.current.contentDocument), 'text/html');
                            const editableElements = newDoc.querySelectorAll("." + editableKeyword);
                            
                            for (let i = 0; i < editableElements.length; i++) {
                                editableElements[i].classList.remove(editableKeyword);
                            }

                            // changed to also update file if necessary
                            ApiInstance.updateFile(
                                newDesign.Name,
                                newDesign.Name,
                                new XMLSerializer().serializeToString(newDoc),
                                "design", 
                                design.Id, 
                                Object.values(newDesign),
                                getPayloadAsJson()?.company,
                                newDesign.Template_id,
                            ).then(res => {
                                if (res.status === "SUCCESS") {
                                    alert("Design is goedgekeurd")
                                } else {
                                    alert("Design is NIET goedgekeurd.");
                                }
                            })
                        });

                        window.location.reload();
                        return;
                    }
                }
            }} style={{ width: "100%" }}>
                {props.text}
            </Button>
        )
    }

    function fileNameValidation(fileName: string) {
        const FileNameArray = fileName.split('.');
        const newFileName = FileNameArray[0];
        return newFileName.indexOf(' ') >= 0;
    }

    function fotosToevoegenButton(isAdmin: boolean) {
        if (!isAdmin) return;
        return (
            <label htmlFor="contained-button-file">
                <Input
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={(e) => {
                        (async () => {
                            var extValidation = /(\.jpg|\.jpeg|\.gif|\.png)$/i;
                            for (let i = 0; i < e.target.files!.length; i++) {
                                if (e.target.files![i].size > 20971520) {
                                    alert('Uw foto is te groot!');
                                } else if (
                                    fileNameValidation(e.target.files![i].name) ||
                                    !extValidation.exec(e.target.files![i].name)
                                ) {
                                    alert(
                                        'Uw foto bevat een spatie in de naam of de verkeerde extensie!'
                                    );
                                } else {
                                    if (
                                        Object.keys(props.queryParams).length === 0 &&
                                        props.queryParams.constructor === Object
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
                        })();
                    }}
                />
                <Button variant="contained" component="span" color="primary">
                    Foto's toevoegen
                </Button>
            </label>
        );
        
    }

    function EditorTextField() {
        return (
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
                inputProps={{ maxLength: parseInt(selectedElement.element.dataset.textLimit) }}
            />
        )
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
                <InputLabel id="templateEditorSelectWrapLabel">Wrap</InputLabel>
                <Select
                    id="templateEditorSelectWrap"
                    labelId='templateEditorSelectWrapLabel'
                    label="Wrap"
                    value={textWrap}
                    onChange={handleWrapping}
                    ref={wrapOptionsRef}
                >
                    <MenuItem value={"normal"}>Wrap</MenuItem>
                    <MenuItem value={"nowrap"}>No wrap</MenuItem>
                </Select>
            </FormControl>
        )
    }

    function EditorTextAlign() {
        return (
            <FormControl style={{ width: "100%" }}>
                <InputLabel id="templateEditorSelectAlignLabel">Align</InputLabel>
                <Select
                    id="templateEditorSelectAlign"
                    labelId='templateEditorSelectAlignLabel'
                    label="Align"
                    value={textAlign}
                    onChange={handleAlign}
                    ref={alignOptionsRef}
                >
                    <MenuItem value={"left"}>Left</MenuItem>
                    <MenuItem value={"center"}>Center</MenuItem>
                    <MenuItem value={"right"}>Right</MenuItem>
                </Select>
            </FormControl>
        )
    }

    function EditorImageGallery() {
        return (
            <Button variant="contained" style={{ textAlign: "center" }} onClick={() => { setFotoLibView(!fotoLibView) }}>
                Kies een afbeelding
            </Button>
        )
    }

    function EditorMarkAsEditable() {
        return (
            <FormControlLabel
                label="Editable by customer"
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

    function generateEditorMenu() {
        const elements = [];

        if (selectedElement !== null && selectedElement.type === "text") {
            elements.push(<EditorTextField />)
            elements.push(<EditorTextSize />)
            elements.push(<EditorTextWrap />)
            elements.push(<EditorTextAlign />)
        }

        if (selectedElement !== null && selectedElement.type === "image") {
            elements.push(<EditorImageGallery />)
        }

        if (selectedElement !== null) {
            elements.push(<EditorMarkAsEditable />)
        }

        return elements;
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
                    <h1>Upload template</h1>
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
                        <Stack spacing={2} alignItems={"center"} style={{ width: "95%", margin: "20px 10px 0 10px" }}>
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
                                            Laad export bestanden
                                        </Button>
                                    </label>
                                )
                            }
                            {
                                templateFiles.length > 1 &&
                                <>
                                    <Button variant="contained" component="span" onClick={() => setTemplatePos(templatePos + 1)} style={{ width: "100%" }}>
                                        Volgende
                                    </Button>
                                    <Button variant="contained" component="span" onClick={() => setTemplatePos(templatePos - 1)} style={{ width: "100%" }}>
                                        Vorige
                                    </Button>
                                </>
                            }
                            <>{generateEditorMenu()}</>
                            {
                                templateFiles.length > 0 && isAdminTemplateMode && 
                                <ActionButton text="Upload" confirmMessage="Weet u zeker dat u de template wilt uploaden?" />
                            }
                            {
                                templateFiles.length > 0 && isModerator() && isEmployee() && isTemplateMode && 
                                <ActionButton text="Maak design" confirmMessage="Weet u zeker dat u een design wilt maken?" />
                            }
                            {
                                templateFiles.length > 0 && isAdminDesignMode || (isModerator() && isDesignMode) && isDesignPending &&
                                <ActionButton text="Valideer" confirmMessage="Weet u zeker dat u de design wilt goedkeuren?" />
                            }
                            <Button variant="contained" component="span" style={{ width: "100%", textAlign: "center" }} onClick={async () => {
                                const element = document.createElement('div');
                                element.innerHTML = templateFiles[templatePos]?.data;
                                await ApiInstance.makePDF(templateFiles[templatePos]?.data, element.offsetHeight);
                                
                                //download(pdf.content.pdf, "pdf.pdf");
                            }}>Download pdf</Button>
                            <Button variant="contained" component="span" style={{ width: "100%", textAlign: "center" }} onClick={e => {
                                const confirmResult = window.confirm("Weet u zeker dat u terug wilt gaan? Uw veranderingen worden niet opgeslagen.");

                                if (confirmResult) {
                                    window.location = isAdmin() ? "/admin-portal" : "/user-portal";
                                }
                            }}>
                                Terug naar {isAdmin() ? "admin portaal" : "user portaal"}
                            </Button>
                        </Stack>
                    </Box>
                </Grid>
                <Grid item xs={true}>
                    {templateFiles.length > 0 && templatePos >= 0 && templatePos <= templateFiles.length - 1 && !fotoLibView ?
                        <iframe onLoad={handleTemplateLoad}
                            title="templateViewer"
                            srcDoc={templateFiles[templatePos]?.data}
                            style={{ height: "100%", width: "100%" }}
                            ref={editorFrameRef}
                            id="IframeDoc"
                        ></iframe>
                        : fotoLibView ?
                            mainPage(getPayloadAsJson()!.type === "Admin" ? props : queryParamsObject, imageList, getPayloadAsJson()!.type !== "Employee" ? true : false, setImageList, stylesFotoLib, true)
                            :
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
