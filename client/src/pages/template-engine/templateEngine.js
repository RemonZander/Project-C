import './templateEngine.css';
import { useEffect, useState } from 'react';
import { CreateExport } from '../../helpers/Export';
import { readFile, readFileAsDataUrl } from '../../helpers/FileReader';
import { Button, StepLabel, styled } from '@material-ui/core';

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
    const [exportFiles, setExportFiles] = useState(null);
    const [templateFiles, setTemplateFiles] = useState([]);

    useEffect(() => {
        if (exportFiles !== null && templateFiles.length === 0) {
            // Omdat het lezen van bestanden asynchrounous gaat, wrappen wij onze for loop in een async functie zodat wij
            // bij onze readFile statements een await keyword mee kunnen geven.
            // Dit zorgt ervoor dat alle promises worden voldaan in sync.

            // Needs some refinement in some areas (mainly lessen the amount of for loops if possible)
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
                    } 
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
                                border: 2rem solid black !important;
                                border-radius: 0.8rem !important;
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

                    files['html'][i]['data'] = new XMLSerializer().serializeToString(doc);
                }

                setTemplateFiles(files['html']);
            })();
        }
    }, [exportFiles, templateFiles]);

    const handleOnLoad = (e) => {
        const doc = e.target.contentDocument;

        const containerElements = doc.getElementsByTagName('div');
        let textElements = [];

        for (let i = 0; i < containerElements.length; i++) {
            const el = containerElements[i];
            // el.children[0].classList?.includes('Basic-Paragraph')
            // console.log(el.children)
            console.log(Array.from(el.classList).includes);
            if (Array.from(el.classList).includes('Basic-Text-Frame')) {
            }
            // const text = Array.from(paragraphElements[i].childNodes).map(el => el.innerText).join(' ').trim();
            // console.log(text);
            // console.log(containerElements[i].closest());
        }

        // const editableElements = [].concat(text, paragraph);

        // editableElements.forEach((el) => el.classList.add('selectable'));
    };

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

    return (
        <div className="templateEngineContainer">
            <label htmlFor="contained-button-file">
                <Input
                    id="contained-button-file"
                    multiple
                    webkitdirectory="true"
                    directory="true"
                    type="file"
                    onChange={(e) => {
                        setExportFiles(e.target.files);
                    }}
                />
                <Button variant="contained" component="span">
                    Load Export Files
                </Button>
            </label>
            <div className="controls-wrapper">
                <button
                    className="previous"
                    onClick={() => setTemplatePos(templatePos - 1)}
                    style={buttonHandler('previous', templatePos, templateFiles)}
                >
                    Previous
                </button>
                <button
                    className="next"
                    onClick={() => setTemplatePos(templatePos + 1)}
                    style={buttonHandler('next', templatePos, templateFiles)}
                >
                    Next
                </button>
            </div>
            <div className="templateEngineWrapper">
                {templateFiles.length > 0 &&
                    templatePos >= 0 &&
                    templatePos <= templateFiles.length - 1 && (
                        <iframe
                            title="templateViewer"
                            className="templateEngineFrame"
                            srcDoc={templateFiles[templatePos]['data']}
                        ></iframe>
                    )}
            </div>
        </div>
    );
}

export default CreateExport('/template-editor', TemplateEngine);
