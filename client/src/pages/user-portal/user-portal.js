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
    MenuItem,
    Menu,
} from '@material-ui/core';
import {
    Settings,
    ChevronLeft,
    ChevronRight,
    PhotoCamera,
    Panorama,
    Brush,
    Menu as MenuIcon,
    ContactSupport,
    AccountCircle,
} from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import { getPayloadAsJson } from '../../helpers/Token';

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

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-$400px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    })
);

function UserPortal() {
    const user = getPayloadAsJson();
    console.log(user);
    const theme = useTheme();
    const styles = useStyles();
    const [isModerator] = useState(user.type === 'Moderator' ? true : false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);
    const handleDrawerOpen = () => {
        setOpenDrawer(true);
        document.getElementById('AppBar').style.width = window.innerWidth - 280 + 'px';
        document.getElementById('userPortalMainPage').style.marginLeft = '280px';
    };

    const handleDrawerClose = () => {
        setOpenDrawer(false);
        document.getElementById('AppBar').style.width = window.innerWidth + 'px';
        document.getElementById('userPortalMainPage').style.marginLeft = '10px';
    };

    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Box sx={{ display: 'flex' }}>
                <AppBar
                    position="fixed"
                    open={openDrawer}
                    style={{ background: 'white' }}
                    id="AppBar"
                >
                    <Toolbar>
                        <IconButton color={'primary'} onClick={handleDrawerOpen}>
                            <MenuIcon />
                        </IconButton>
                        <img
                            src={kyndalogo}
                            alt="kynda logo"
                            width="90"
                            height="30"
                            style={{ marginRight: '20px', marginLeft: '20px' }}
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
                                    style={{ color: 'black', cursor: 'pointer' }}
                                    fontSize="large"
                                    onClick={handleClickMenu}
                                    aria-controls="basic-menu"
                                    aria-haspopup="true"
                                    aria-expanded={openMenu ? 'true' : undefined}
                                />
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={openMenu}
                                    onClose={handleCloseMenu}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                    style={{ marginTop: '50px' }}
                                >
                                    <MenuItem onClick={handleCloseMenu}>
                                        <AccountCircle
                                            style={{ fontSize: '110px', marginRight: '15px' }}
                                        />
                                        {user.naam}
                                        <br />
                                        {user.email}
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem
                                        onClick={handleCloseMenu}
                                        style={{ marginTop: '10px' }}
                                    >
                                        Account gegevens wijzigen
                                    </MenuItem>
                                    <MenuItem
                                        onClick={handleCloseMenu}
                                        style={{ marginTop: '10px' }}
                                    >
                                        Login gegevens wijzigen
                                    </MenuItem>
                                    {isModerator ? (
                                        <MenuItem
                                            onClick={handleCloseMenu}
                                            style={{ marginTop: '10px' }}
                                        >
                                            Hoofdgebruiker account wijzigen
                                        </MenuItem>
                                    ) : (
                                        ''
                                    )}
                                </Menu>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <Drawer
                    id="Drawer"
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
                    open={openDrawer}
                >
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        <ListItem
                            className="listItemButton"
                            onClick={() => {
                                window.open('/fotogalerij', '_blank').focus();
                            }}
                        >
                            <PhotoCamera style={{ marginRight: '20px' }}></PhotoCamera>
                            <Typography variant="h5">Fotogalerij</Typography>
                        </ListItem>
                        <ListItem className="listItemButton">
                            <Panorama style={{ marginRight: '20px' }}></Panorama>
                            <Typography variant="h5">Alle templates</Typography>
                        </ListItem>
                        <ListItem className="listItemButton">
                            <Brush style={{ marginRight: '20px' }}></Brush>
                            <Typography variant="h5">Alle designs</Typography>
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem>
                            <Typography variant="h7">
                                Kynda contactgegevens:
                                <br />
                                Goudsesingel 156 | 3011 KD Rotterdam
                                <br />
                                +31 (0) 10 3075454
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Typography variant="h7">
                                Hoofdgebruiker contactgegevens:
                                <br />
                                Schilderswijk 55 | 2111 FD DenHaag
                                <br />
                                +31 (0) 12 3456789
                            </Typography>
                        </ListItem>
                    </List>
                </Drawer>
            </Box>
            <div style={{ marginTop: '70px', marginLeft: '10px' }} id="userPortalMainPage">
                fdsfds
            </div>
        </React.Fragment>
    );
}

export default CreateExport('/user-portal', UserPortal);
