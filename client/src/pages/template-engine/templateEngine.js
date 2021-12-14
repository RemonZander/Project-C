import { useEffect, useState } from 'react';
import { CreateExport } from '../../helpers/Export';
import { readFile, readFileAsDataUrl } from '../../helpers/FileReader';
import { Box, Grid, styled } from '@material-ui/core';
import { Button, Stack } from '@mui/material';

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

function TemplateEngine() {
    const [templatePos, setTemplatePos] = useState(0);
    const [templateFiles, setTemplateFiles] = useState([]);

    function loadFilesHandler(e) {
        // Omdat het lezen van bestanden asynchrounous gaat, wrappen wij onze for loop in een async functie zodat wij
        // bij onze readFile statements een await keyword mee kunnen geven.
        // Dit zorgt ervoor dat alle promises worden voldaan in sync.

        // Needs some refinement in some areas (mainly lessen the amount of for loops if possible)

        const exportFiles = e.target.files;
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

            if (!(files['js'].some(obj => obj.name === 'FontData.js'))) {
                alert("Geen fontdata script gevonden. Zijn de fonts ingeladen?");
                return;
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
                        `;
                    node.innerHTML = css.replace(/\r?\n|\r/g, '');
                    doc.getElementsByTagName('head')[0].appendChild(node);
                }

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

                // Change all image references to data urls
                const imgTags = doc.getElementsByTagName('img');

                for (let i = 0; i < imgTags.length; i++) {
                    const imgTag = imgTags[i];

                    const srcName = imgTag.src.split('/').at(-1);

                    const imgObj = files['images'].find(imgObj => imgObj['name'] === srcName);

                    if (imgObj !== undefined) {
                        imgTag.src = imgObj['data'];
                    }
                }

                // const wrapper = doc.getElementById('outer-wrapper');

                // const getEntryPointRecursive = (container, entryPoints = [], closestEntryPoint = "") => {
                //     const children = container.children;
                //     const entryPoint = entryPoints.filter(point => point.id === closestEntryPoint)[0];

                //     for (let i = 0; i < children.length; i++) {
                //         const child = children[i];

                //         // Assume that we found an entrypoint and give it an appropiate ID
                //         if (child.id === "" && child.tagName.toLowerCase() === "div" && child.style.length !== 0) {
                //             child.id = "layer_" + entryPoints.length;
                //             child.className = "layer selectable";

                //             entryPoints.push({
                //                 id: child.id,
                //                 element: child,
                //                 spanClasses: [],
                //                 pElements: [],
                //                 spanElements: []
                //             });
                //         }

                //         if (child.tagName.toLowerCase() === "p") {
                //             entryPoint.pElements.push(child);
                //         }

                //         if (child.tagName.toLowerCase() === "span") {
                //             entryPoint.spanElements.push(child);

                //             if (!entryPoint.spanClasses.includes(child.className)) {
                //                 entryPoint.spanClasses.push(child.className);
                //             }
                //         }

                //         if (child.children.length !== 0) {
                //             getEntryPointRecursive(child, entryPoints, child.id === "" ? closestEntryPoint : child.id);
                //         }
                //     }

                //     return entryPoints;
                // }

                // const entryPoints = getEntryPointRecursive(wrapper);

                // console.log(entryPoints);

                // for (let i = 0; i < entryPoints.length; i++) {
                //     const point = entryPoints[i];

                //     const mergedSpan = [];

                //     point.spanClasses.forEach(spanClass => {
                //         const span = doc.createElement('span');
                //         span.className = spanClass

                //         mergedSpan.push(span);
                //     })

                //     console.log(mergedSpan);

                //     mergedSpan.forEach(span => {
                //         point.spanElements.forEach(el => {
                //             if (el.className === span.className) {
                //                 span.innerText += el.innerText;
                //             }
                //         })
                //     })

                // for (let i = 0; i < point.element.children.length; i++) {
                //     const child = point.element.children[i];

                //     if (child.tagName.toLowerCase() === "p") {

                //     }
                //     point.pElements[i].remove();

                //     point.element.appendChild(mergedSpan[i]);
                //     point.element.appendChild(doc.createElement('br'));
                // }

                //     point.spanElements.forEach(span => {
                //         if (!(span.className in textObject)) {
                //             textObject[span.className] = [];
                //         }    

                //         textObject[span.className].push(span.innerText);
                //     })

                //     let j = 0;

                // point.pElements.forEach(p => {

                // })

                //     for (const key in textObject) {
                //         if (Object.hasOwnProperty.call(textObject, key)) {
                //             const span = doc.createElement('span');
                //             span.className = key;
                //             span.innerText = textObject[key].join(' ').trim();
                //             // span.style.fontSize = "100vw";
                //             console.log(point.pElements[j]);
                //             // point.element.replaceChild(span, point.pElements[j])
                //             // point.element.appendChild(span);
                //             // point.element.appendChild(doc.createElement('br'));

                //             j++;

                //         }
                //     }
                // }
                // Algorithm
                // Container: De container waar de elementen in moet. In de container zit de entrypoint die een
                // aantal lagen diep kan zijn.
                // Entrypoint: Punt waarbij de nieuwe geformateerde tekst ingeladen moet worden. De entrypoint bevat (bijna) altijd de tekst (p) elementen
                // Teksten: Tekst elementen die de tekst bevatten. Dit zijn span elementen met 1 woord erin
                // Styling: Elke tekst bevat een classname die bepaalt wat voor styling de tekst bevat.
                // Dit moet onthouden worden zodat die op het eind stukje op de juiste tekst gezet kan worden.

                files['html'][i]['data'] = new XMLSerializer().serializeToString(doc);
            }


            setTemplateFiles(files['html']);
        })();
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

    function onLoadHandler(e) {
        const doc = e.target.contentDocument;
        const wrapper = doc.getElementById('outer-wrapper');

        // Does more than just getting the entry points
        // it also adds ids, classes and events to the elements it goes through
        const getEntryPointRecursive = (container, entryPoints = [], closestEntryPoint = "") => {
            const children = container.children;
            const entryPoint = entryPoints.filter(point => point.id === closestEntryPoint)[0];

            for (let i = 0; i < children.length; i++) {
                const child = children[i];

                // Assume that we found an entrypoint and give it an appropiate ID
                if (child.id === "" && child.tagName.toLowerCase() === "div" && child.style.length !== 0) {
                    child.id = "layer_" + entryPoints.length;
                    child.className = "layer selectable";

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
                    getEntryPointRecursive(child, entryPoints, child.id === "" ? closestEntryPoint : child.id);
                }
            }

            return entryPoints;
        }

        const entryPoints = getEntryPointRecursive(wrapper);

        for (let i = 0; i < entryPoints.length; i++) {
            const point = entryPoints[i];

            point.element.onclick = () => {
                const text = prompt();

                point.element.innerHTML = `<span class="${point.spanClasses[0]}">${text}</span>`
            }

            const mergedSpan = [];

            point.spanClasses.forEach(spanClass => {
                const span = doc.createElement('span');
                span.className = spanClass

                mergedSpan.push(span);
            })

            mergedSpan.forEach(span => {
                point.spanElements.forEach(el => {
                    if (el.className === span.className) {
                        span.innerText += el.innerText;
                    }
                })
            })
        }
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
                    <Stack spacing={2} alignItems={"center"} style={{ width: "100%", marginTop: "10px" }}>
                        <label htmlFor="contained-button-file">
                            <Input
                                id="contained-button-file"
                                multiple
                                webkitdirectory="true"
                                directory="true"
                                type="file"
                                onChange={loadFilesHandler}
                            />
                            <Button variant="contained" component="span">
                                Load Export Files
                            </Button>
                        </label>
                        {
                            templateFiles.length > 1 &&
                            <>
                                <Button variant="contained" component="span" onClick={() => setTemplatePos(templatePos + 1)}>
                                    Next
                                </Button>
                                <Button variant="contained" component="span" onClick={() => setTemplatePos(templatePos - 1)}>
                                    Previous
                                </Button>
                            </>
                        }
                    </Stack>
                </Box>
            </Grid>
            <Grid item xs={true}>
                {templateFiles.length > 0 &&
                templatePos >= 0 &&
                templatePos <= templateFiles.length - 1 && (
                    <iframe onLoad={onLoadHandler}
                        title="templateViewer"
                        srcDoc={templateFiles[templatePos]['data']}
                        style={{ height: "100%", width: "100%" }}
                    ></iframe>
                )}
            </Grid>
        </Grid>
    );
}

export default CreateExport('/template-editor', TemplateEngine);
