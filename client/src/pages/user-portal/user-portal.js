import * as React from 'react';
import './user-portal.css';
import kyndalogo from './kynda.png';
import testimg1 from './testimg1.png';
import testimg2 from './testimg2.png';
import testimg3 from './testimg3.png';
import Enumerable from 'linq';
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
    Paper,
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
import { getPayloadAsJson, getToken } from '../../helpers/Token';
import Api from '../../helpers/Api';
import Image from 'image-js';

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: '20px',
    },
    cardGrid: {
        padding: '20px 0',
    },
    card: {
        width: '200px',
        height: '100%',
    },
    cardMedia: {},
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

async function getDesigns() {
    const user = getPayloadAsJson();
    const ApiInstance = new Api(getToken());
    let designListDb = [];
    let templateListDb = [];
    if (typeof (designListDb = await ApiInstance.all('design')) === 'undefined') {
        window.alert('De verbinding met de database is verbroken. Probeer het later opnieuw.');
        return;
    }

    if (typeof (templateListDb = await ApiInstance.all('template')) === 'undefined') {
        window.alert('De verbinding met de database is verbroken. Probeer het later opnieuw.');
        return;
    }
    let templateIdList = Enumerable.from(templateListDb.content)
        .where((t) => t.Company_id === user.company)
        .select((i) => i.Id)
        .toArray();
    let designList = Enumerable.from(designListDb.content)
        .where((d) => Enumerable.from(templateIdList).contains(d.Template_id))
        .orderBy((d) => d.Template_id)
        .toArray();
}

async function makeImages() {
    let templist = [];
    let img = await Image.load(testimg1);
    let temp = new imageData(await img.toDataURL(), img.width, img.height);
    templist.push(temp);
    img = await Image.load(testimg2);
    temp = new imageData(await img.toDataURL(), img.width, img.height);
    templist.push(temp);
    img = await Image.load(testimg3);
    temp = new imageData(await img.toDataURL(), img.width, img.height);
    templist.push(temp);
    return templist;
}

class imageData {
    constructor(dataURL, width, height) {
        this.dataURL = dataURL;
        this.width = width;
        this.height = height;
    }
}

function UserPortal() {
    const user = getPayloadAsJson();
    const theme = useTheme();
    const styles = useStyles();
    const [designList, SetdesignList] = React.useState([]);
    const [imgList, SetimgList] = React.useState([]);
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

    React.useEffect(() => {
        (async () => {
            SetimgList(await makeImages());
        })();
    }, []);

    React.useEffect(() => {
        (async () => {
            SetdesignList(await getDesigns());
        })();
    }, []);

    console.log(imgList[0]);
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
                        <IconButton
                            color={'primary'}
                            onClick={openDrawer ? handleDrawerClose : handleDrawerOpen}
                        >
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
                                        onClick={() => {
                                            handleCloseMenu();
                                            window.open('/user-portal-settings', '_blank').focus();
                                        }}
                                        style={{ marginTop: '10px' }}
                                    >
                                        Accountgegevens wijzigen
                                    </MenuItem>
                                    <MenuItem
                                        onClick={handleCloseMenu}
                                        style={{ marginTop: '10px' }}
                                    >
                                        Logingegevens wijzigen
                                    </MenuItem>
                                    {isModerator ? (
                                        <MenuItem
                                            onClick={handleCloseMenu}
                                            style={{ marginTop: '10px' }}
                                        >
                                            Hoofdgebruikeraccount wijzigen
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
                <Container maxWidth="md" className={styles.cardGrid}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6} md={4} key={0}>
                            <Card className={styles.card}>
                                <CardMedia className={styles.cardMedia} title={'test'}>
                                    <img
                                        id="testimg"
                                        src={imgList[0]}
                                        style={{ width: '200px', height: '280px' }}
                                    />
                                </CardMedia>
                                <CardContent className={styles.cardContent}>
                                    <Typography gutterBottom variant="h6" align="center">
                                        {'test img card'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default CreateExport('/user-portal', UserPortal);
