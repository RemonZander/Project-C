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

//===========MATERIAL DESIGN styles===========
const Input = styled('input')({
    display: 'none',
});

const useStyles = makeStyles((theme) => ({
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

const ApiInstance = new Api(getToken());

function Gallery() {
    const [isAdmin] = useState(true);
    const [images, setImages] = useState([]);
    const styles = useStyles();

    useEffect(() => {
        (async () => {
            const imagesFromDatabase = await ApiInstance.all('image');
            const images = imagesFromDatabase.content;
            setImages(images);
        })();
    }, []);

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
                        <Grid item>{adminButton(isAdmin, images, setImages)}</Grid>
                        <Grid item>
                            <div className="searchbar">
                                <input type="text" placeholder="Zoeken..." />
                            </div>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary">
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
                <div>
                    <Container maxWidth="md" className={styles.cardGrid}>
                        <Grid container spacing={4}>
                            {images.length === 0 ? (
                                <Typography gutterBottom variant="h6" align="center">
                                    Geen foto's
                                </Typography>
                            ) : (
                                images.map((image, index) => {
                                    const initialImageURL =
                                        process.env.REACT_APP_SERVER_URL + image.Filepath;
                                    const actualImageURL = initialImageURL.replace(/\\/g, '/');
                                    const imageFilePath = image.Filepath;
                                    const imagePathArray = imageFilePath.split('\\');
                                    const imagePathName = imagePathArray[imagePathArray.length - 1];
                                    const imageName = imagePathName.split('.');
                                    console.log(image.Id);

                                    let token = getPayloadAsJson();
                                    if (token.company === image.Company_id) {
                                        return (
                                            <Grid item xs={12} sm={6} md={4} key={index}>
                                                <Card className={styles.card}>
                                                    <Button
                                                        id={'btn' + index}
                                                        variant="contained"
                                                        style={deleteButton(isAdmin)}
                                                        onMouseEnter={() =>
                                                            imageOnHover(index, styles)
                                                        }
                                                        onMouseLeave={() =>
                                                            imageLeave(index, styles)
                                                        }
                                                        onClick={(e) =>
                                                            selectedPicture(
                                                                e,
                                                                isAdmin ? 'delete' : 'select',
                                                                image.Id,
                                                                images,
                                                                setImages
                                                            )
                                                        }
                                                    >
                                                        {isAdmin ? 'Verwijderen' : 'Selecteren'}
                                                    </Button>
                                                    <CardMedia
                                                        id={'img' + index}
                                                        className={styles.cardMedia}
                                                        title={imageName[0]}
                                                        image={actualImageURL}
                                                        onMouseEnter={() =>
                                                            imageOnHover(index, styles)
                                                        }
                                                        onMouseLeave={() =>
                                                            imageLeave(index, styles)
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
                                })
                            )}
                        </Grid>
                    </Container>
                </div>
            </main>
        </>
    );
}

export default CreateExport('/fotogalerij', Gallery);

function imageOnHover(id) {
    const imgId = 'img' + id;
    const buttonId = 'btn' + id;
    document.getElementById(imgId).style.filter = 'blur(4px)';
    document.getElementById(imgId).style.transition = '1s';
    document.getElementById(buttonId).style.transition = '1s';
    document.getElementById(buttonId).style.opacity = '1';
    document.getElementById(buttonId).style.top =
        String(document.getElementById(imgId).height / 1.5) + 'px';
    document.getElementById(buttonId).style.left =
        String(document.getElementById(imgId).width / 7) + 'px';
}

function imageLeave(id) {
    const imgId = 'img' + id;
    const buttonId = 'btn' + id;
    document.getElementById(imgId).style.filter = 'none';
    document.getElementById(buttonId).style.opacity = '0';
}

function selectedPicture(picture, type, id, images, setImages) {
    picture.preventDefault();
    if (type === 'select') {
        alert('Uw foto is geselecteerd!');
    } else {
        console.log(id);
        ApiInstance.removeImage(id);
    }
}

function adminButton(isAdmin, images, setImages) {
    if (isAdmin) {
        return (
            <label htmlFor="contained-button-file">
                <Input
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={(e) => {
                        var extCheck = /(\.jpg|\.jpeg|\.gif|\.png)$/i;
                        for (let i = 0; i < e.target.files.length; i++) {
                            if (e.target.files[i].size > 20971520) {
                                alert('Uw foto is te groot!');
                            } else if (
                                !extCheck.exec(e.target.files[i].name) ||
                                fileNameValidation(e.target.files[i].name)
                            ) {
                                alert(
                                    'Uw foto bevat de verkeerde extensie of een spatie in de naam!'
                                );
                            } else {
                                ApiInstance.createImage(e.target.files[i]);
                                alert('Uw foto is toegevoegd!');
                                window.location.reload();
                            }
                        }
                    }}
                />
                <Button variant="contained" component="span" color="primary">
                    Foto's toevoegen
                </Button>
            </label>
        );
    }
}

function fileNameValidation(fileName) {
    const FileNameArray = fileName.split('.');
    const newFileName = FileNameArray[0];
    return newFileName.indexOf(' ') >= 0;
}

function deleteButton(isAdmin) {
    if (isAdmin) {
        return { color: 'white', backgroundColor: 'red', opacity: 0 };
    } else {
        return { color: 'white', backgroundColor: 'blue', opacity: 0 };
    }
}
