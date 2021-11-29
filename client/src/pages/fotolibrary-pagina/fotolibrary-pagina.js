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
import voorbeeld1 from './voorbeeld1.jpg';
import voorbeeld2 from './voorbeeld2.jpg';
import voorbeeld3 from './voorbeeld3.jpg';
import voorbeeld4 from './voorbeeld4.jpg';
import voorbeeld5 from './voorbeeld5.jpg';
import voorbeeld6 from './voorbeeld6.jpg';
import { CreateExport } from '../../helpers/Export';
import Api from '../../helpers/Api';

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

const ApiInstance = new Api();

function Gallery() {
    const [isAdmin] = useState(true);
    const styles = useStyles();
    let fotoStorage = [voorbeeld1, voorbeeld2, voorbeeld3, voorbeeld4, voorbeeld5, voorbeeld6];
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
                            {fotolibrary(fotoStorage, isAdmin, styles)}
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

function selectedPicture(picture, type) {
    picture.preventDefault();
    if (type === 'select') {
        alert('Uw foto is geselecteerd!');
    } else {
        alert('De geselecteerde foto is verwijderd!');
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

function fotolibrary(fotoStorage, isAdmin, styles) {
    let fotolibrary = [];

    for (let a = 1; a <= fotoStorage.length; a++) {
        fotolibrary.push(
            <Grid item xs={12} sm={6} md={4}>
                <Card className={styles.card}>
                    <Button
                        id={'btn' + a}
                        variant="contained"
                        style={deleteButton(isAdmin)}
                        onMouseEnter={() => imageOnHover(a, styles)}
                        onMouseLeave={() => imageLeave(a, styles)}
                        onClick={(e) => selectedPicture(e, isAdmin ? 'delete' : 'select')}
                    >
                        {isAdmin ? 'Verwijderen' : 'Selecteren'}
                    </Button>
                    <CardMedia
                        id={'img' + a}
                        className={styles.cardMedia}
                        image={fotoStorage[a - 1]}
                        title="imageTitle"
                        onMouseEnter={() => imageOnHover(a, styles)}
                        onMouseLeave={() => imageLeave(a, styles)}
                    />
                    <CardContent className={styles.cardContent}>
                        <Typography gutterBottom variant="h6" align="center">
                            Naam van foto
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        );
    }
    return fotolibrary;
}
