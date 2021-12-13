import * as React from 'react';
import './user-portal.css';
import kyndalogo from './kynda.png';
import cog from './cog69420.png';
import plus from './plusafbeelding.png';
import { CreateExport } from '../../helpers/Export';
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
    Box,
    List,
    Drawer,
    IconButton,
    Divider,
    ListItem,
} from '@material-ui/core';
import {
    Settings,
    ChevronLeft,
    ChevronRight,
    PhotoCamera,
    Panorama,
    Brush,
    menu,
    ContactSupport,
} from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';

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

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

function UserPortal() {
    const styles = useStyles();
    const [open, setOpen] = useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    return (
        <React.Fragment>
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
                        User
                    </Typography>
                    <Typography variant="h5" style={{ color: 'black', marginLeft: '6px' }}>
                        portal
                    </Typography>
                    <Grid container spacing={2} justifyContent="flex-end">
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    document.cookie = document.cookie.substring(
                                        document.cookie.indexOf('token='),
                                        6
                                    );
                                    window.location.replace('/').focus();
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
                                onClick={() => {}}
                            />
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <main>
                <Box sx={{ display: 'flex' }}>
                    <Button variant="contained" color="primary" onClick={handleDrawerOpen}>
                        open
                    </Button>
                    <menu></menu>
                    <Drawer
                        sx={{
                            width: '400px',
                            flexShrink: 0,
                            '& .MuiDrawer-paper': {
                                width: '400px',
                                boxSizing: 'border-box',
                            },
                        }}
                        variant="persistent"
                        anchor="left"
                        open={open}
                    >
                        <DrawerHeader>
                            <IconButton onClick={handleDrawerClose}>{<ChevronLeft />}</IconButton>
                        </DrawerHeader>
                        <Divider />
                        <List>
                            <ListItem>
                                <PhotoCamera style={{ marginRight: '20px' }}></PhotoCamera>
                                <Typography variant="h5">Fotogalerij</Typography>
                            </ListItem>
                            <ListItem>
                                <Panorama style={{ marginRight: '20px' }}></Panorama>
                                <Typography variant="h5">Alle templates</Typography>
                            </ListItem>
                            <ListItem>
                                <Brush style={{ marginRight: '20px' }}></Brush>
                                <Typography variant="h5">Alle designs</Typography>
                            </ListItem>
                        </List>
                        <Divider />
                        <List>
                            <ListItem>
                                <Typography variant="h7">Kynda contactgegevens:</Typography>
                                <Typography variant="h7">
                                    Goudsesingel 156 | 3011 KD Rotterdam
                                </Typography>
                                <Typography variant="h7">+31 (0) 10 3075454</Typography>
                            </ListItem>
                            <ListItem>
                                <Typography variant="h7">
                                    Hoofdgebruiker contactgegevens: Schilderswijk 55 | 2111 FD Den
                                    Haag +31 (0) 12 3456789
                                </Typography>
                            </ListItem>
                        </List>
                    </Drawer>
                </Box>
            </main>
        </React.Fragment>
    );
}

export default CreateExport('/user-portal', UserPortal);
