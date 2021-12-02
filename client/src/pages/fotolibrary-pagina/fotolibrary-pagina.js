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
import { useState } from 'react';
import { CreateExport } from '../../helpers/Export';
import Api from '../../helpers/Api';
import { getToken } from '../../helpers/Token';

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
    const [fotolibrary, updateFotolibrary] = useState([]);
    const styles = useStyles();
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
                    <Grid container spacing={2} justify="flex-end">
                        <Grid item>{adminButton(isAdmin)}</Grid>
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
                            {fotolibrary}
                            {/* De state-update vind plaats in de gallery functie maar waar moet ik die aanroepen? */}
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

function selectedPicture(picture, type, id) {
    picture.preventDefault();
    if (type === 'select') {
        alert('Uw foto is geselecteerd!');
    } else {
        ApiInstance.delete('image', id);
    }
}

function adminButton(isAdmin) {
    if (isAdmin) {
        return (
            <label htmlFor="contained-button-file">
                <Input
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={(e) => {
                        for (let i = 0; i < e.target.files.length; i++) {
                            ApiInstance.createImage(e.target.files[i]);
                        }
                        alert('Uw foto is toegevoegd!');
                    }}
                />
                <Button variant="contained" component="span" color="primary">
                    Foto's toevoegen
                </Button>
            </label>
        );
    }
}

function deleteButton(isAdmin) {
    if (isAdmin) {
        return { color: 'white', backgroundColor: 'red', opacity: 0 };
    } else {
        return { color: 'white', backgroundColor: 'blue', opacity: 0 };
    }
}

async function getImagesFromDatabase() {
    const imagesFromDatabase = await ApiInstance.all('image');
    const images = imagesFromDatabase.content;
    return images;
}

function gallery(isAdmin, styles, fotolibrary, updateFotolibrary) {
    getImagesFromDatabase().then((listOfImages) => {
        console.log(listOfImages);
        if (listOfImages.length === 0) {
            updateFotolibrary((fotolibrary) => [
                ...fotolibrary,
                <Typography gutterBottom variant="h6" align="center">
                    Geen foto's
                </Typography>,
            ]);
        } else {
            for (let a = 0; a < listOfImages.length; a++) {
                // if (listOfImages[a].Company_id == )
                const imageURL = process.env.REACT_APP_SERVER_URL + listOfImages[a].Filepath;
                updateFotolibrary((fotolibrary) => [
                    ...fotolibrary,
                    <Grid item xs={12} sm={6} md={4}>
                        <Card className={styles.card}>
                            <Button
                                id={'btn' + a}
                                variant="contained"
                                style={deleteButton(isAdmin)}
                                onMouseEnter={() => imageOnHover(a, styles)}
                                onMouseLeave={() => imageLeave(a, styles)}
                                onClick={(e) =>
                                    selectedPicture(e, isAdmin ? 'delete' : 'select', a)
                                }
                            >
                                {isAdmin ? 'Verwijderen' : 'Selecteren'}
                            </Button>
                            <CardMedia
                                id={'img' + a}
                                className={styles.cardMedia}
                                title="imageTitle"
                                image={imageURL}
                                onMouseEnter={() => imageOnHover(a, styles)}
                                onMouseLeave={() => imageLeave(a, styles)}
                            />
                            <CardContent className={styles.cardContent}>
                                <Typography gutterBottom variant="h6" align="center">
                                    Naam van foto
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>,
                ]);
            }
        }
    });
}
