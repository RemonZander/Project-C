import { useEffect, useRef, useState } from 'react';
import { CreateExport } from '../../helpers/Export';
import { readFile, readFileAsDataUrl } from '../../helpers/FileReader';
import { Box, Grid, styled } from '@material-ui/core';
import { Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { getPayloadAsJson } from '../../helpers/Token';

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

function TemplateEngine(props) {
    const [templatePos, setTemplatePos] = useState(0);
    const [templateFiles, setTemplateFiles] = useState([]);
    const [templateImages, setTemplateImages] = useState([]);
    const [entryPoints, setEntryPoints] = useState([]);
    const [templateDoc, setTemplateDoc] = useState(null);
    const [selectedElement, setSelectedElement] = useState(null);
    const [textFieldValue, setTextFieldValue] = useState("");
    const [textWrap, setTextWrap] = useState("");
    const [textAlign, setTextAlign] = useState("");
    const [isElementEditable, setIsElementEditable] = useState(false);
    const [fixApplied, setFixApplied] = useState(false);
    
    const textFieldRef = useRef(null);
    const wrapOptionsRef = useRef(null);
    const alignOptionsRef = useRef(null);
    const editableCheckboxRef = useRef(null);
    
    const keyword = 'editable';

    useEffect(() => {
        if (textFieldRef.current !== null) {
            textFieldRef.current.value = textFieldValue;
        }
        if (wrapOptionsRef.current !== null) {
            wrapOptionsRef.current.value = textWrap;
        }
        if (alignOptionsRef.current !== null) {
            alignOptionsRef.current.value = textAlign;
        }
        if (editableCheckboxRef.current !== null) {
            editableCheckboxRef.current.checked = selectedElement.classList.contains(keyword);
        }
    })

    function loadFilesHandler(e) {
        // Omdat het lezen van bestanden asynchrounous gaat, wrappen wij onze for loop in een async functie zodat wij
        // bij onze readFile statements een await keyword mee kunnen geven.
        // Dit zorgt ervoor dat alle promises worden voldaan in sync.

        // Needs some refinement in some areas (mainly lessen the amount of for loops if possible)

        const exportFiles = e.target.files;

        if (e.target.files.length !== 0) {
            (async () => {
                let files = {
                    html: [],
                    css: [],
                    images: [],
                    js: [],
                };
    
                const createObj = (file, data) => {
                    return {
                        name: file.name,
                        data: data,
                    };
                };
    
                // TODO: Should only ready 1 template and process whenever a new template gets into the screen. Cache like behaviour.
                for (let i = 0; i < exportFiles.length; i++) {
                    const file = exportFiles[i];
    
                    if (file.type === 'text/html') {
                        files['html'].push(createObj(file, await readFile(file)));
                    } else if (file.type === 'text/css') {
                        files['css'].push(createObj(file, await readFile(file)));
                    } else if (file.type === 'text/javascript') {
                        files['js'].push(createObj(file, await readFile(file)));
                    } else if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
                        files['images'].push(createObj(file, await readFileAsDataUrl(file)));
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
                        if (child.tagName === 'LINK' || child.tagName === 'SCRIPT') child.remove();
                    })
    
                    // Add the contents of the css files as a style element to the html document
                    for (let i = 0; i < files['css'].length; i++) {
                        const node = document.createElement('style');
                        const css =
                            files['css'][i]['data'] +
                            `
                                .selectable:hover {
                                    outline: 2rem solid black !important;
                                    outline-radius: 0.8rem !important;
                                    cursor: pointer !important;
                                }
                                .editable {
                                    outline: 2rem solid black !important;
                                    outline-radius: 0.8rem !important;
                                }
                            `;
    
                        node.innerHTML = css.replace(/\r?\n|\r/g, '');
                        doc.getElementsByTagName('head')[0].appendChild(node);
                    }
    
                    if (fontDataLoaded) {
                        for (let i = 0; i < files['js'].length; i++) {
                            const node = document.createElement('script');
                            const js = files['js'][i]['data'];
    
                            const newJs = js.replace(js.substring(js.indexOf('document'), js.lastIndexOf(';') + 1), `
                            const head = document.getElementsByTagName('head')[0];
                            const styleNode = document.createElement('style');
                            styleNode.innerHTML = buildFontRule(nameArray[i], dataArray[i], fontStyle[i][j], fontWeight[i], fontStretch[i]);
                            head.appendChild(styleNode);
                        `)
    
                            node.innerHTML = newJs;
    
                            doc.getElementsByTagName('head')[0].appendChild(node);
                        }
                    }
    
                    files['html'][i]['data'] = new XMLSerializer().serializeToString(doc);
                }
    
                setTemplateFiles(files['html']);
                setTemplateImages(files['images']);
            })();
        }
    }

    function buttonHandler(buttonName, templatePosition, templateFiles) {
        if (buttonName === 'previous') {
            if (templatePosition === 0) {
                return { display: 'none' };
            }
        } else {
            if (templatePosition === templateFiles.length - 1) {
                return { display: 'none' };
            }
        }
    }

    function handleTemplateLoad(e) {
        const doc = e.target.contentDocument;
        const wrapper = doc.getElementById('outer-wrapper');
        const imgTags = doc.getElementsByTagName('img');

        // Returns an object that includes the name and the dataUrl (signed as data)
        const findImageByUrl = (url) => templateImages.find(imgObj => imgObj['name'] === url.split('/').at(-1));

        // Replace image tags sources with data urls
        for (let i = 0; i < imgTags.length; i++) {
            const imgTag = imgTags[i];

            const imgObj = findImageByUrl(imgTag.src);

            if (imgObj !== undefined) {
                imgTag.src = imgObj['data'];
            }
        }

        // Self calling function that returns the entry points for use further down the code
        // It also adds ids, classes and events to the elements it goes through
        const entryPoints = (function getEntryPointsRecursive(container, entryPoints = [], closesElementWithId = "") {
            const children = container.children;
            const entryPoint = entryPoints.filter(point => point.id === closesElementWithId)[0];

            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                const childStyles = getComputedStyle(child);

                if (childStyles.backgroundImage !== 'none') {
                    const url = childStyles.backgroundImage.split("\"")[1];

                    if (!(url.startsWith('data:'))) {
                        child.style.backgroundImage = `url(${findImageByUrl(url)['data']})`;
                    }
                }

                // Assume that we found an entrypoint and give it an appropiate ID
                if (child.id === "" && child.tagName.toLowerCase() === "div" && child.style.length !== 0) {
                    child.id = "layer_" + entryPoints.length;
                    child.className = "layer";

                    entryPoints.push({
                        id: child.id,
                        element: child,
                        spanClasses: [],
                        pElements: [],
                        spanElements: []
                    });
                }

                if (child.tagName.toLowerCase() === "p") {
                    entryPoint.pElements.push(child);
                }

                if (child.tagName.toLowerCase() === "span") {
                    entryPoint.spanElements.push(child);

                    if (!entryPoint.spanClasses.includes(child.className)) {
                        entryPoint.spanClasses.push(child.className);
                    }
                }

                if (child.children.length !== 0) {
                    getEntryPointsRecursive(child, entryPoints, child.id === "" ? closesElementWithId : child.id);
                }
            }

            return entryPoints;
        })(wrapper);

        setEntryPoints(entryPoints);
        setTemplateDoc(doc);
    }

    function handleOnClickFix(e) {
        const doc = templateDoc;

        for (let i = 0; i < entryPoints.length; i++) {
            const point = entryPoints[i];

            const mergedSpan = [];

            point.spanClasses.forEach(spanClass => {
                const span = doc.createElement('span');
                span.className = spanClass

                mergedSpan.push(span);
            })

            point.pElements.forEach(p => p.remove());

            mergedSpan.forEach(span => {
                point.spanElements.forEach(el => {
                    if (el.className === span.className) {
                        span.innerText += el.innerText + ' ';
                    }
                })

                span.innerText = span.innerText.trim();

                // Default styling values
                span.style.display = "block";
                span.style.lineHeight = 1;
                span.style.whiteSpace = "normal";
                span.style.textAlign = "left";
                span.className += " selectable";

                span.onclick = (e) => {
                    setSelectedElement(e.target);
                    setTextFieldValue(e.target.innerText);
                    setTextWrap(e.target.style.whiteSpace);
                    setTextAlign(e.target.style.textAlign);
                    setIsElementEditable(e.target.classList.contains(keyword))
                }

                point.element.appendChild(span);
            })
        }

        alert("Fix applied");

        setFixApplied(true);
    }

    function handleTextChange(e) {
        selectedElement.innerText = e.target.value;
        setTextFieldValue(e.target.value);
    }

    function handleWrapping(e) {
        selectedElement.style.whiteSpace = e.target.value;
        setTextWrap(e.target.value);
    }

    function handleAlign(e) {
        selectedElement.style.textAlign = e.target.value;
        setTextAlign(e.target.value);
    }

    function handleCheckboxEditable(e) {
        const list = selectedElement.classList;

        e.target.checked ? list.add(keyword) : list.remove(keyword);

        setIsElementEditable(list.contains(keyword))
    }

    function handleSaveText(e) {
        setSelectedElement(null);
    }

    return (
        <Grid container style={{ overflow: "hidden" }}>
            <Grid item xs={2} style={{ height: "100vh" }}>
                <Box
                    component={Grid}
                    container
                    boxShadow={3}
                    style={{ height: "inherit" }}
                >
                    <Stack spacing={2} alignItems={"center"} style={{ width: "95%", margin: "10px 10px 0 10px" }}>
                        {
                            getPayloadAsJson().type === "Admin" && (
                                <label htmlFor="contained-button-file" style={{ width: "100%" }}>
                                    <Input
                                        id="contained-button-file"
                                        multiple
                                        webkitdirectory="true"
                                        directory="true"
                                        type="file"
                                        onChange={loadFilesHandler}
                                    />
                                    <Button variant="contained" component="span" style={{ width: "100%" }}>
                                        Load export files
                                    </Button>
                                </label>
                            )
                        }
                        {
                            templateFiles.length > 0 && !fixApplied && (
                                <Button variant="contained" component="span" onClick={handleOnClickFix} style={{ width: "100%" }}>
                                    Try fix
                                </Button>
                            )
                        }
                        {
                            templateFiles.length > 1 &&
                            <>
                                <Button variant="contained" component="span" onClick={() => setTemplatePos(templatePos + 1)} style={{ width: "100%" }}>
                                    Next
                                </Button>
                                <Button variant="contained" component="span" onClick={() => setTemplatePos(templatePos - 1)} style={{ width: "100%" }}>
                                    Previous
                                </Button>
                            </>
                        }
                        {
                            selectedElement !== null && 
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
                                />
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
                                <Button variant="contained" component="span" color="success" onClick={handleSaveText} style={{ width: "100%" }}>
                                    Done
                                </Button>
                            </>
                        }
                    </Stack>
                </Box>
            </Grid>
            <Grid item xs={true}>
                {templateFiles.length > 0 &&
                templatePos >= 0 &&
                templatePos <= templateFiles.length - 1 ? 
                    <iframe onLoad={handleTemplateLoad}
                        title="templateViewer"
                        srcDoc={templateFiles[templatePos]['data']}
                        style={{ height: "100%", width: "100%" }}
                    ></iframe>
                    :
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                    }}>No template selected</div>
                }
            </Grid>
        </Grid>
    );
}

export default CreateExport('/template-editor', TemplateEngine);
