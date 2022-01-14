//// @ts-nocheck

import './fotolibrary-pagina.css';
import {
    Typography,
    AppBar,
    Button,
    Card,
    CardContent,
    CardMedia,
    CssBaseline,
    Grid,
    Toolbar,
    Container,
    styled,
} from '@material-ui/core';
import { Settings } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import kyndalogo from './kynda.png';
import { useState, useEffect } from 'react';
import { CreateExport } from '../../helpers/Export';
import Api from '../../helpers/Api';
import { getPayloadAsJson, getToken } from '../../helpers/Token';
import { PageProps } from '../../@types/app';
import { Image } from '../../@types/general';
import { ClassNameMap } from '@mui/material';

//===========MATERIAL DESIGN styles===========
const Input = styled('input')({
    display: 'none',
});

const useStyles = makeStyles(() => ({
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
//===========MATERIAL DESIGN styles===========

const ApiInstance = new Api(getToken()!);

function Gallery(props: PageProps) {
    const [isAdmin, SetIsAdmin] = useState(false);
    const [images, setImages] = useState(Array<Image>());
    const styles = useStyles();

    useEffect(() => {
        (async () => {
            const imagesFromDatabase = await ApiInstance.all('image');
            const images = Image.makeImageArray(imagesFromDatabase.content);
            setImages(images);
            console.log(getPayloadAsJson()!);
            let currentUser = getPayloadAsJson()!;
            if (currentUser.type == "Admin" || "Moderator") {
                SetIsAdmin(true);
            }
        })();
    }, []);

    function adminButton(isAdmin: boolean) {
        if (isAdmin) {
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
                                            window.location.reload();
                                        } else {
                                            await ApiInstance.createImage(
                                                e.target.files![i],
                                                typeof (props.queryParams.companyId) === 'string' ? parseInt(props.queryParams.companyId) : props.queryParams.companyId
                                            );
                                            window.location.reload();
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
    }

    function fileNameValidation(fileName: string) {
        const FileNameArray = fileName.split('.');
        const newFileName = FileNameArray[0];
        return newFileName.indexOf(' ') >= 0;
    }

    return (
        <>
            <CssBaseline />
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
                        Fotogalerij
                    </Typography>
                    <Grid container spacing={2} justifyContent="flex-end">
                        <Grid item>{adminButton(isAdmin)}</Grid>
                        <Grid item>
                            <div className="searchbar">
                                <input type="text" placeholder="Zoeken..." />
                            </div>
                        </Grid>
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
                            <Settings
                                className={styles.icon}
                                style={{ color: 'black' }}
                                fontSize="large"
                            />
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <main>
                {mainPage(props, images, isAdmin, setImages, styles, false)}
            </main>
        </>
    );
}

export function mainPage(props: PageProps, images: Array<Image>, isAdmin: boolean, setImages: React.Dispatch<React.SetStateAction<Image[]>>, styles: ClassNameMap, select: boolean) {
    return (
        <div>
            <Container maxWidth="md" className={styles.cardGrid}>
                <Grid container spacing={4}>
                    {imagesEmpty(images) ? (
                        <Typography gutterBottom variant="h6" align="center">
                            Geen foto's
                        </Typography>
                    ) : (
                        images.map((image, index) => {
                            const initialImageURL =
                                process.env.REACT_APP_SERVER_URL + image.Filepath;
                            const actualImageURL = initialImageURL.replace(/\\/g, '/');
                            const imageName = retrieveImageName(image.Filepath);
                            let token = getPayloadAsJson();
                            let userCompany;
                            if (
                                Object.keys(props.queryParams).length === 0 &&
                                props.queryParams.constructor === Object
                            ) {
                                userCompany = token!.company;
                            } else {
                                userCompany = props.queryParams.companyId;
                            }
                            if (userCompany == image.Company_Id) {
                                if (isAdmin) {
                                    return (
                                        <Grid item xs={12} sm={6} md={4} key={index}>
                                            <Card className={styles.card}>
                                                {select ? <Button
                                                    id={'btn' + index}
                                                    variant="contained"
                                                    style={{ color: 'white', backgroundColor: 'blue', opacity: 0 }}
                                                    onMouseEnter={() =>
                                                        imageOnHover(index, isAdmin, select)
                                                    }
                                                    onMouseLeave={() =>
                                                        imageLeave(index, isAdmin, select)
                                                    }
                                                    onClick={(e) =>
                                                        selectedPicture(
                                                            e, 'select',
                                                            image.Id
                                                        )
                                                    }
                                                >
                                                    {'Selecteren'}
                                                </Button> : ''}
                                                <CardMedia
                                                    id={'img' + index}
                                                    className={styles.cardMedia}
                                                    title={imageName[0]}
                                                    image={actualImageURL}
                                                    onMouseEnter={() =>
                                                        imageOnHover(index, isAdmin, select)
                                                    }
                                                    onMouseLeave={() =>
                                                        imageLeave(index, isAdmin, select)
                                                    }
                                                />
                                                <Button
                                                    id={'btnDelete' + index} 
                                                    variant="contained"
                                                    style={ {color: 'white', backgroundColor: 'red', opacity: 0} }
                                                    onMouseEnter={() =>
                                                        imageOnHover(index, isAdmin, select)
                                                    }
                                                    onMouseLeave={() =>
                                                        imageLeave(index, isAdmin, select)
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
                                                <CardContent className={styles.cardContent}>
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
                                            <Card className={styles.card}>
                                                {select ? <Button
                                                    id={'btn' + index}
                                                    variant="contained"
                                                    style={{ color: 'white', backgroundColor: 'blue', opacity: 0 }}
                                                    onMouseEnter={() =>
                                                        imageOnHover(index, isAdmin, select)
                                                    }
                                                    onMouseLeave={() =>
                                                        imageLeave(index, isAdmin, select)
                                                    }
                                                    onClick={(e) =>
                                                        selectedPicture(
                                                            e, 'select',
                                                            image.Id
                                                        )
                                                    }
                                                >
                                                    {'Selecteren'}
                                                </Button> : ''}
                                                <CardMedia
                                                    id={'img' + index}
                                                    className={styles.cardMedia}
                                                    title={imageName[0]}
                                                    image={actualImageURL}
                                                    onMouseEnter={() =>
                                                        imageOnHover(index, isAdmin, select)
                                                    }
                                                    onMouseLeave={() =>
                                                        imageLeave(index, isAdmin, select)
                                                    }
                                                />
                                                <CardContent className={styles.cardContent}>
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
    );

    function imagesEmpty(images: Array<Image>) {
        let userCompany;
        if (
            Object.keys(props.queryParams).length === 0 &&
            props.queryParams.constructor === Object
        ) {
            console.log("getting new company id");
            let userToken = getPayloadAsJson();
            userCompany = userToken!.company;
        } else {
            userCompany = props.queryParams.companyId;
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
        if (isAdmin) {
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

            document.getElementById(buttonDeleteId)!.style.transition = '1s';
            document.getElementById(buttonDeleteId)!.style.opacity = '1';
            document.getElementById(buttonDeleteId)!.style.top =
                String(parseInt(document.getElementById(imgId)!.style.height) / 1.5) + 'px';
            document.getElementById(buttonDeleteId)!.style.left =
                String(parseInt(document.getElementById(imgId)!.style.width) / 7) + 'px'; 
        }
        else {
            const buttonId = 'btn' + id;
            document.getElementById(imgId)!.style.filter = 'blur(4px)';
            document.getElementById(imgId)!.style.transition = '1s';
            document.getElementById(buttonId)!.style.transition = '1s';
            document.getElementById(buttonId)!.style.opacity = '1';
            document.getElementById(buttonId)!.style.top =
                String(parseInt(document.getElementById(imgId)!.style.height) / 1.5) + 'px';
            document.getElementById(buttonId)!.style.left =
                String(parseInt(document.getElementById(imgId)!.style.width) / 7) + 'px';  
        }
    }

    function imageLeave(id: number, isAdmin: boolean, select: boolean) {
        const imgId = 'img' + id;
        if (isAdmin) {
            const buttonId = 'btn' + id;
            const buttonDeleteId = 'btnDelete' + id;
            
            document.getElementById(imgId)!.style.filter = 'none';
            if (select) document.getElementById(buttonId)!.style.opacity = '0';           

            document.getElementById(imgId)!.style.filter = 'none';
            document.getElementById(buttonDeleteId)!.style.opacity = '0';
        }
        else {
            const buttonId = 'btn' + id; 
            document.getElementById(imgId)!.style.filter = 'none';
            if (select) document.getElementById(buttonId)!.style.opacity = '0';
        }
    }

    function selectedPicture(picture: any, type: string, id: number) {
        picture.preventDefault();
        if (type === 'select') {
            alert('Uw foto is geselecteerd!');
        } else {
            console.log(id);
            (async () => {
                await ApiInstance.removeImage(id);
                window.location.reload();
            })();
        }
    }
}

export default CreateExport('/fotogalerij', Gallery);
