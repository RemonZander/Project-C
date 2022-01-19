//// @ts-nocheck

import * as React from 'react';
import './user-portal.css';
import kyndalogo from './kynda.png';
import testimg1 from './testimg1.png';
import testimg2 from './testimg2.png';
import testimg3 from './testimg3.png';
import Enumerable from 'linq';
import { PageProps } from '../../@types/app';
import { Design, Template, User, Image } from '../../@types/general';
import { CreateExport } from '../../helpers/Export';
import { mainPage } from '../fotolibrary-pagina/fotolibrary-pagina';
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
    Popover,
    TextField,
} from '@material-ui/core';
import {
    Settings,
    ChevronLeft,
    ChevronRight,
    PhotoCamera,
    Panorama,
    Brush,
    Menu as MenuIcon,
    AccountCircle,
    Info,
    Add,
    Home,
} from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import { getPayloadAsJson, getToken } from '../../helpers/Token';
import Api from '../../helpers/Api';
import { Payload } from '../../@types/token';
import { ClassNameMap } from '@mui/material';

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
        width: '300px',
        height: '100%',
        position: 'relative',
    },
    cardMedia: {},
    cardContent: {
        flexGrow: 1,
    },
}));

const useStylesFotoLib = makeStyles(() => ({
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
    const ApiInstance = new Api(getToken()!);
    const theme = useTheme();
    const styles = useStyles();
    const stylesFotoLib = useStylesFotoLib();
    const [designList, setdesignList] = useState(Array<Design>());
    const [templateList, settemplateList] = useState(Array<Template>());
    const [designView, setDesignView] = useState(false);
    const [infoView, setInfoView] = useState(Array<boolean>());
    const [templateView, settemplateView] = useState(false);
    const [settingsView, setSettingsView] = useState(false);
    const [fotoLibView, setFotoLibView] = useState(false);
    const [changeName, setChangeName] = useState(false);
    const [changeEmail, setChangeEmail] = useState(false);
    const [isModerator] = useState(getPayloadAsJson()!.type === 'Moderator' ? true : false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [changeNameInput, setChangeNameInput] = useState('');
    const [changeEmailInput, setChangeEmailInput] = useState('');
    const [newPassInput, setNewPassInput] = useState('');
    const [confirmPassInput, setConfirmPassInput] = useState('');
    const [currentPassInput, setCurrentPassInput] = useState('');
    const [passErrorMsg, setPassErrorMsg] = useState(['', '', '']);
    const [newUserErrorMsg, setnewUserErrorMsg] = useState(['', '', '']);
    const [changeUserDataErrorMsg, setChangeUserDataErrorMsg] = useState(['', '']);
    const [newUserNameInput, setNewUserNameInput] = useState('');
    const [newUserEmailInput, setnewUserEmailInput] = useState('');
    const [newUserPassInput, setnewUserPassInput] = useState('');
    const [headerMsg, setheaderMsg] = useState(['Home', 'pagina']);
    const [userList, setUserList] = useState(Array<User>());
    const [anchorEl, setAnchorEl] = useState(null);
    const [imageList, setImageList] = useState(Array<Image>());
    const openMenu = Boolean(anchorEl);
    const handleDrawerOpen = () => {
        setOpenDrawer(true);
        document.getElementById('AppBar')!.style.width = window.innerWidth - 280 + 'px';
        document.getElementById('userPortalMainPage')!.style.marginLeft = '280px';
    };

    const handleDrawerClose = () => {
        setOpenDrawer(false);
        document.getElementById('AppBar')!.style.width = window.innerWidth + 'px';
        document.getElementById('userPortalMainPage')!.style.marginLeft = '10px';
    };

    const handleClickMenu = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleInputchangeEmail = (event: any) => {
        setChangeEmailInput(event.target.value);
    }

    const handleInputchangeName = (event: any) => {
        setChangeNameInput(event.target.value);
    }

    const handleInputChangeNewUserPass = (event: any) => {
        setnewUserPassInput(event.target.value);
    }

    const handleInputChangeNewUserEmail = (event: any) => {
        setnewUserEmailInput(event.target.value);
    }

    const handleInputChangeNewUserName = (event: any) => {
        setNewUserNameInput(event.target.value);
    }

    const handleInputChangeCurrentPass = (event: any) => {
        setCurrentPassInput(event.target.value);
    };

    const handleInputChangeNewPass = (event: any) => {
        setNewPassInput(event.target.value);
    };

    const handleInputChangeConfirmPass = (event: any) => {
        setConfirmPassInput(event.target.value);
    };

    const loadImages = async() => {
        const ApiInstance = new Api(getToken()!);
        const imagesFromDatabase = await ApiInstance.all('image');
        setImageList(Image.makeImageArray(imagesFromDatabase.content));
    };

    useEffect(() => {
        (async () => {
            settemplateList(await getTemplates());
            setdesignList(await getDesigns());
            setInfoView(await makeInfoViewBoolList());
            setUserList(await getUsers());
            
            loadImages();
        })();
    }, []);

    const queryParamsObject: { queryParams: { [key: string]: string | number } } = { queryParams: {'companyId': getPayloadAsJson()!.company.toString()} };
    return (
        <React.Fragment>
            <CssBaseline />
            <Box sx={{ display: 'flex' }}>
                <AppBar position="fixed" style={{ background: 'white' }} id="AppBar">
                    <Toolbar>
                        <IconButton color={'primary'} onClick={openDrawer ? handleDrawerClose : handleDrawerOpen}>
                            <MenuIcon />
                        </IconButton>
                        <img src={kyndalogo} alt="kynda logo" width="90" height="30" style={{ marginRight: '20px', marginLeft: '20px' }} />
                        <Typography variant="h5" style={{ color: 'black', marginLeft: '6px' }}>
                            {headerMsg[0]}
                        </Typography>
                        <Typography variant="h5" style={{ color: 'black', marginLeft: '6px' }}>
                            {headerMsg[1]}
                        </Typography>
                        <Grid container spacing={2} justifyContent="flex-end">
                            {fotoLibView && isModerator ? <Grid item>
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
                                                        await ApiInstance.createImage(
                                                            e.target.files![i],
                                                            getPayloadAsJson()!.company
                                                        );
                                                        loadImages();
                                                    }
                                                }
                                            })();
                                        }}
                                    />
                                    <Button variant="contained" component="span" color="primary">
                                        Foto's toevoegen
                                    </Button>
                                </label>
                            </Grid> : ''}
                            <Grid item>
                                <Button variant="contained" color="primary"
                                    onClick={() => {
                                        document.cookie = document.cookie.substring(document.cookie.indexOf('token='), 6);
                                        window.location.replace('/');
                                    }}>
                                    Uitloggen
                                </Button>
                            </Grid>
                            <Grid item>
                                <Settings className={styles.icon} style={{ color: 'black', cursor: 'pointer' }} fontSize="large"
                                    onClick={handleClickMenu}
                                    aria-controls="basic-menu"
                                    aria-haspopup="true"
                                    aria-expanded={openMenu ? 'true' : undefined}
                                />
                                <Menu id="basic-menu" anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu} MenuListProps={
                                    {
                                        'aria-labelledby': 'basic-button',
                                    }}
                                    style={{ marginTop: '50px' }}>
                                    <MenuItem onClick={handleCloseMenu}>
                                        <AccountCircle style={{ fontSize: '110px', marginRight: '15px' }} />
                                        {getPayloadAsJson()!.naam}<br />{getPayloadAsJson()!.email}
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem onClick={() => {
                                        handleCloseMenu();
                                        setDesignView(false);
                                        settemplateView(false);
                                        setFotoLibView(false);
                                        setheaderMsg(['Instellingen', '']);
                                        setSettingsView(true);
                                        setCurrentPassInput("");
                                        setConfirmPassInput("");
                                        setNewPassInput("");
                                        setPassErrorMsg(["", "", ""]);
                                        setChangeNameInput("");
                                        setChangeEmailInput("");
                                        setNewUserNameInput("");
                                        setnewUserEmailInput("");
                                        setnewUserPassInput("");
                                        setChangeName(false);
                                        setChangeEmail(false);
                                        window.scroll(0, 0);
                                    }}
                                        style={{ marginTop: '10px' }}>
                                        Accountgegevens wijzigen
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                        handleCloseMenu();
                                        setDesignView(false);
                                        setFotoLibView(false);
                                        settemplateView(false);
                                        setheaderMsg(['Instellingen', '']);
                                        setSettingsView(true);
                                        setCurrentPassInput("");
                                        setConfirmPassInput("");
                                        setNewPassInput("");
                                        setPassErrorMsg(["", "", ""]);
                                        setChangeNameInput("");
                                        setChangeEmailInput("");
                                        setNewUserNameInput("");
                                        setnewUserEmailInput("");
                                        setnewUserPassInput("");
                                        setChangeName(false);
                                        setChangeEmail(false);
                                        window.scroll(0, window.innerHeight / 2.5);
                                    }}
                                        style={{ marginTop: '10px' }}>
                                        Wachtwoord wijzigen
                                    </MenuItem>
                                    {isModerator ? (
                                        <MenuItem onClick={() => {
                                            handleCloseMenu();
                                            setDesignView(false);
                                            settemplateView(false);
                                            setFotoLibView(false);
                                            setheaderMsg(['Instellingen', '']);
                                            setSettingsView(true);
                                            setCurrentPassInput("");
                                            setConfirmPassInput("");
                                            setNewPassInput("");
                                            setPassErrorMsg(["", "", ""]);
                                            setChangeNameInput("");
                                            setChangeEmailInput("");
                                            setNewUserNameInput("");
                                            setnewUserEmailInput("");
                                            setnewUserPassInput("");
                                            setChangeName(false);
                                            setChangeEmail(false);
                                            window.scroll(0, window.innerHeight / 1);
                                        }}
                                            style={{ marginTop: '10px' }}>
                                            Hoofdgebruikeraccount wijzigen
                                        </MenuItem>
                                    ) : ''}
                                </Menu>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <Drawer id="Drawer"
                    variant="persistent"
                    anchor="left"
                    open={openDrawer}>
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {designView || templateView || settingsView || fotoLibView ? <><ListItem className="listItemButton" onClick={() => {
                            setDesignView(false);
                            settemplateView(false);
                            setSettingsView(false);
                            setFotoLibView(false);
                            setheaderMsg(['Home', 'pagina']);
                            handleDrawerClose();
                        }}>
                            <Home style={{ marginRight: '20px' }}></Home>
                            <Typography variant="h5">Home pagina</Typography>
                        </ListItem><Divider /></> : ''}
                        {fotoLibView ? <ListItem className="listItemButton" onClick={() => {
                            setFotoLibView(!fotoLibView);
                            setDesignView(false);
                            settemplateView(false);
                            setSettingsView(false);
                            setheaderMsg(['Fotogalerij', '']);
                            handleDrawerClose();
                        }}
                            style={{ backgroundColor: 'lightgray' }}>
                            <PhotoCamera style={{ marginRight: '20px' }}></PhotoCamera>
                            <Typography variant="h5">Fotogalerij</Typography>
                        </ListItem> : <ListItem className="listItemButton" onClick={() => {
                            setFotoLibView(!fotoLibView);
                            setDesignView(false);
                            settemplateView(false);
                            setSettingsView(false);
                            setheaderMsg(['Fotogalerij', '']);
                            handleDrawerClose();
                        }}>
                            <PhotoCamera style={{ marginRight: '20px' }}></PhotoCamera>
                            <Typography variant="h5">Fotogalerij</Typography>
                        </ListItem>}
                        {designView ? <ListItem className="listItemButton" onClick={() => {
                            setDesignView(!designView);
                            settemplateView(false);
                            setSettingsView(false);
                            setFotoLibView(false);
                            setheaderMsg(['Alle', 'designs']);
                            handleDrawerClose();
                        }}
                            style={{ backgroundColor: 'lightgray' }}>
                            <Brush style={{ marginRight: '20px' }}></Brush>
                            <Typography variant="h5">Alle designs</Typography>
                        </ListItem> : <ListItem className="listItemButton" onClick={() => {
                            setDesignView(!designView);
                            settemplateView(false);
                            setSettingsView(false);
                            setFotoLibView(false);
                            setheaderMsg(['Alle', 'designs']);
                            handleDrawerClose();
                        }}>
                            <Brush style={{ marginRight: '20px' }}></Brush>
                            <Typography variant="h5">Alle designs</Typography>
                        </ListItem>}
                        {templateView ? <ListItem className="listItemButton" onClick={() => {
                            setDesignView(false);
                            setSettingsView(false);
                            settemplateView(!templateView);
                            setFotoLibView(false);
                            setheaderMsg(['Alle', 'templates']);
                            handleDrawerClose();
                        }}
                            style={{ backgroundColor: 'lightgray' }}>
                            <Panorama style={{ marginRight: '20px' }}></Panorama>
                            <Typography variant="h5">Alle templates</Typography>
                        </ListItem> : <ListItem className="listItemButton" onClick={() => {
                            setDesignView(false);
                            setSettingsView(false);
                            settemplateView(!templateView);
                            setFotoLibView(false);
                            setheaderMsg(['Alle', 'templates']);
                            handleDrawerClose();
                        }}>
                            <Panorama style={{ marginRight: '20px' }}></Panorama>
                            <Typography variant="h5">Alle templates</Typography>
                        </ListItem>}
                    </List>
                    <Divider />
                    <List>
                        <ListItem>
                            <Typography style={{ fontSize: '14px' }}>
                                Kynda contactgegevens:<br />Goudsesingel 156 | 3011 KD Rotterdam<br />+31 (0) 10 3075454
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Typography style={{ fontSize: '14px' }}>
                                Hoofdgebruiker contactgegevens:<br />Schilderswijk 55 | 2111 FD DenHaag<br />+31 (0) 12 3456789
                            </Typography>
                        </ListItem>
                    </List>
                </Drawer>
            </Box>
            <div style={{ marginTop: '70px' }} id="userPortalMainPage" onClick={handleDrawerClose}>
                {!settingsView && !fotoLibView ? <Container maxWidth="md" className={styles.cardGrid}>
                    <Grid container spacing={4}>
                        {typeof designList !== 'undefined' && !templateView
                            ? designList.map((design, index) => {
                                if (index < 5 || designView) {
                                    return (
                                        <Grid item xs={12} sm={3} md={4} key={index}>
                                            <Card className={styles.card}>
                                                <CardMedia className={styles.cardMedia} title={'test'}>
                                                    <img id="testimg" src={testimg2} style={{ width: '300px', }} />
                                                </CardMedia>
                                                {!infoView[index] ? (
                                                    <Button style={{
                                                        position: 'absolute',
                                                        top: '5px',
                                                        left: '5px',
                                                        background: 'rgb(63, 81, 181)',
                                                    }}
                                                        onClick={() => {
                                                            setInfoView(
                                                                makeNewInfoViewBoolList(
                                                                    index,
                                                                    designList,
                                                                    infoView
                                                                )
                                                            );
                                                        }}>
                                                        <Info style={{ color: 'white' }} />
                                                    </Button>
                                                ) : (
                                                    <List style={{
                                                        position: 'absolute',
                                                        top: '0px',
                                                        left: '0px',
                                                        background: 'white',
                                                        color: 'black',
                                                        height: '80%',
                                                    }}
                                                        onClick={() => {
                                                            setInfoView(
                                                                makeNewInfoViewBoolList(
                                                                    index,
                                                                    designList,
                                                                    infoView
                                                                )
                                                            );
                                                        }}>
                                                        <ListItem style={{
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '20px',
                                                        }}>
                                                            Gegevens
                                                        </ListItem>
                                                        <Divider />
                                                        <ListItem style={{
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}>
                                                            {'Naam: ' + design.Name}
                                                        </ListItem>
                                                        <ListItem style={{
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}>
                                                            {'Template naam: ' + Enumerable.from(templateList).where((t) => t.Id === design.Template_id)
                                                                .select((t) => t.Name).toArray()[0]}
                                                        </ListItem>
                                                        <ListItem style={{
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}>
                                                            {'Gemaakt op: ' + design.Created_at.toLocaleDateString()}
                                                        </ListItem>
                                                        <ListItem style={{
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}>
                                                            {'laatst bijgewerkt: ' + (design.Updated_at.toString() === 'Invalid Date' ? 'nooit' : design.Updated_at.toLocaleDateString())}
                                                        </ListItem>
                                                        <ListItem style={{
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}>
                                                            {'Gevalideerd: ' + (!design.Verified ? 'nee' : 'ja')}
                                                        </ListItem>
                                                    </List>
                                                )}
                                                <CardContent className={styles.cardContent}>
                                                    <Typography gutterBottom variant="h6" align="center">
                                                        {design.Name} <br />
                                                        {!design.Verified && isModerator ?
                                                            <Button variant="contained" color="primary" onClick={() => {
                                                                window.location.href = '/editor?designId=' + design.Id;
                                                            }}>
                                                                Valideren / bewerken
                                                            </Button> : !design.Verified ?
                                                                <Button variant="contained" color="primary" onClick={() => {
                                                                    window.location.href = '/editor?designId=' + design.Id;
                                                                }}>
                                                                    Bewerken
                                                                </Button> : <Button variant="contained" color="primary" onClick={() => {
                                                                    window.location.href = '/editor?designId=' + design.Id;
                                                                }}>
                                                                    Bekijken / Downloaden
                                                                </Button>
                                                        }
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    );
                                }
                            })
                            : templateView
                                ? templateList.map((template, index) => {
                                    return (
                                        <Grid item xs={12} sm={3} md={4} key={index}>
                                            <Card className={styles.card}>
                                                <CardMedia
                                                    className={styles.cardMedia}
                                                    title={'test'}>
                                                    <img
                                                        id="testimg"
                                                        src={testimg3}
                                                        style={{ width: '300px' }}/>
                                                </CardMedia>
                                                <CardContent className={styles.cardContent}>
                                                    <Typography
                                                        gutterBottom
                                                        variant="h6"
                                                        align="center">
                                                        {template.Name}<br/>
                                                        <Button variant="contained" color="primary" onClick={async () => {
                                                            window.location.href = '/editor?templateId=' + template.Id;
                                                        }}>
                                                            Maak design
                                                        </Button>
                                                    </Typography>                                                   
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    );
                                })
                                : ''}
                        {!templateView ? (
                            <Grid item xs={12} sm={3} md={4} key={6}>
                                <Card className={styles.card}>
                                    <CardMedia className={styles.cardMedia} title={'test'}>
                                        <img
                                            id="testimg"
                                            src={testimg1}
                                            style={{ width: '300px' }}/>
                                    </CardMedia>
                                    <Button
                                        style={{
                                            position: 'absolute',
                                            top: '210px',
                                            left: '115px',
                                            background: 'rgb(63, 81, 181)',
                                        }}
                                        onClick={() => {
                                            setDesignView(false);
                                            setSettingsView(false);
                                            settemplateView(!templateView);
                                            setFotoLibView(false);
                                            setheaderMsg(['Alle', 'templates']);
                                        }}>
                                        <Add style={{ color: 'white' }} />
                                    </Button>
                                    <CardContent className={styles.cardContent}>
                                        <Typography gutterBottom variant="h6" align="center">
                                            {'Nieuwe design toevoegen'}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ) : ('')}
                    </Grid>
                </Container> : !fotoLibView ? <Box
                    sx={{
                        display: 'flex',
                        marginTop: '70px',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                    id="userPortalSettingsPage">
                    <List>
                        <ListItem style={{ paddingLeft: '200px', paddingRight: '200px' }}>
                            <AccountCircle style={{ fontSize: '170px', marginRight: '15px' }} />
                            <Typography variant="h6">
                                {getPayloadAsJson()!.naam}
                                <br />
                                {getPayloadAsJson()!.email}
                            </Typography>
                        </ListItem>
                        <Divider />
                    </List>
                        <List>
                            <ListItem>
                                <Typography variant="h6" style={{textAlign: 'center', marginLeft: '120px'}}>
                                    Hieronder kunt u uw naam of e-mail veranderen.<br />
                                    U wordt hierna uitgelogd.
                                </Typography>
                            </ListItem>
                        <ListItem
                            style={{ paddingTop: '50px', paddingBottom: '20px', paddingLeft: '200px', paddingRight: '200px' }}>
                            <Typography variant="h6">
                                {'Naam: '} &emsp;&emsp;&emsp;&nbsp;
                                </Typography>
                                {changeName ? <><TextField required value={changeNameInput} onChange={handleInputchangeName} />&emsp;&emsp;&emsp;&emsp;&emsp;<Button variant="contained" color="primary" onClick={() => {
                                    changeNameOrEmail(changeNameInput, '', changeName, changeEmail, setChangeUserDataErrorMsg);
                                }}>
                                    Toepassen
                                </Button></> : <Typography id="changeName" variant="h6" style={{ cursor: 'pointer' }} onClick={() => {
                                    document.getElementById('changeEmail')!.style.pointerEvents = 'none';
                                    setChangeName(!changeName);
                                }}>
                                    {getPayloadAsJson()!.naam}
                                </Typography>}                               
                        </ListItem>
                        <ListItem style={{ paddingBottom: '50px', paddingLeft: '200px', paddingRight: '200px' }}>
                            <Typography variant="h6">
                                {'E-mail: '} &emsp;&emsp;&emsp;
                                </Typography>
                                {changeEmail ? <><TextField required value={changeEmailInput} onChange={handleInputchangeEmail} />&emsp;&emsp;&emsp;&emsp;&emsp;<Button variant="contained" color="primary" onClick={() => {
                                    changeNameOrEmail('', changeEmailInput, changeName, changeEmail, setChangeUserDataErrorMsg);
                                }}>
                                Toepassen
                                </Button></> : <Typography id="changeEmail" variant="h6" style={{ cursor: 'pointer' }} onClick={() => {
                                    document.getElementById('changeName')!.style.pointerEvents = 'none';
                                    setChangeEmail(!changeEmail);
                                }}>
                                    {getPayloadAsJson()!.email}
                                </Typography>}
                        </ListItem>
                        <Divider />
                        <ListItem style={{ paddingTop: '50px', paddingLeft: '200px', paddingRight: '200px' }}>
                            <Typography variant="h6">
                                {'Huidig wachtwoord: '} &emsp;&emsp;&emsp;
                                <TextField required error={passErrorMsg[0] !== ''} helperText={passErrorMsg[0]} type={'password'} value={currentPassInput} onChange={handleInputChangeCurrentPass} />
                            </Typography>
                        </ListItem>
                        <ListItem style={{ paddingTop: '50px', paddingLeft: '200px', paddingRight: '200px' }}>
                            <Typography variant="h6">{'Nieuw wachtwoord: '} &emsp;&emsp;&emsp;</Typography>
                            <TextField required error={passErrorMsg[1] !== ''} helperText={passErrorMsg[1]} type={'password'} value={newPassInput} onChange={handleInputChangeNewPass} />
                        </ListItem>
                        <ListItem style={{ paddingTop: '50px', paddingLeft: '200px', paddingRight: '200px' }}>
                            <Typography variant="h6">{'Bevestig wachtwoord: '} &emsp;&emsp;</Typography>
                            <TextField id="confirmPass" required error={passErrorMsg[2] !== ''} helperText={passErrorMsg[2]} type={'password'} value={confirmPassInput} onChange={handleInputChangeConfirmPass} />
                        </ListItem>
                        <Typography
                            align="center"
                            style={{ paddingTop: '50px', paddingBottom: '50px', paddingLeft: '200px', paddingRight: '200px' }}>
                            <Button variant="contained" color="primary" onClick={() => {
                                    ChangePass(setCurrentPassInput, setConfirmPassInput, setNewPassInput, getPayloadAsJson()!.sub, currentPassInput, newPassInput, confirmPassInput, setPassErrorMsg);

                                }}>
                                Toepassen
                            </Button>
                        </Typography>
                        <Divider />
                    </List>
                    <List>
                        {getPayloadAsJson()!.type === 'Moderator' ? <ListItem style={{ alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                            <Typography variant="h6">
                                Hieronder kunt u een gebruiker promoveren tot hoofdgebruiker.<br />
                                Er kan maar één hoofdgebruiker zijn. Dit betekent dat <br />het huidige hoofdgebruikeraccount een normale gebruiker wordt.
                            </Typography>
                        </ListItem> : ''}
                        {getPayloadAsJson()!.type === 'Moderator'
                            ? userList.map((user, index) => {
                                if (index % 2 === 0) {
                                    return (
                                        <><ListItem style={{ alignItems: 'center', justifyContent: 'center', marginRight: '50px' }}>
                                            <><ListItem id={'userField' + index} style={{ alignItems: 'center', width: '50%' }}
                                                onMouseEnter={() => userOnHover(index)}
                                                onMouseLeave={() => userLeave(index)}>
                                                <AccountCircle style={{ fontSize: '60px', marginRight: '15px' }} />
                                                <Typography variant="h6">
                                                    {userList[index].Name}
                                                    <br />
                                                    {userList[index].Email}
                                                </Typography>
                                            </ListItem>{index === userList.length - 1 && userList.length % 2 !== 0 ? <Button
                                                variant="contained"
                                                color="primary"
                                                style={{
                                                    position: 'absolute',
                                                    top: '30px',
                                                    left: '275px',
                                                    opacity: 0
                                                }}
                                                id={'userButton' + index}
                                                onMouseEnter={() => userOnHover(index)}
                                                onMouseLeave={() => userLeave(index)}
                                                onClick={() => onMakeMainUserButtonClick(user, getPayloadAsJson()!.sub)}
                                            >
                                                Maak hoofdgebruiker
                                            </Button> : <Button
                                                variant="contained"
                                                color="primary"
                                                style={{
                                                    position: 'absolute',
                                                    top: '30px',
                                                    left: '100px',
                                                    opacity: 0
                                                }}
                                                id={'userButton' + index}
                                                onMouseEnter={() => userOnHover(index)}
                                                onMouseLeave={() => userLeave(index)}
                                                onClick={() => onMakeMainUserButtonClick(user, getPayloadAsJson()!.sub)}
                                            >
                                                Maak hoofdgebruiker
                                            </Button>}</>
                                            {index + 1 < userList.length ? <><ListItem id={'userField' + (index + 1)} style={{ alignItems: 'center', marginLeft: '50px', width: '50%' }}
                                                onMouseEnter={() => userOnHover(index + 1)}
                                                onMouseLeave={() => userLeave(index + 1)}>
                                                <AccountCircle style={{ fontSize: '60px', marginRight: '15px' }} />
                                                <Typography variant="h6">
                                                    {userList[index + 1].Name}
                                                    <br />
                                                    {userList[index + 1].Email}
                                                </Typography>
                                            </ListItem><Button
                                                variant="contained"
                                                color="primary"
                                                style={{
                                                    position: 'absolute',
                                                    top: '30px',
                                                    left: '477px',
                                                    opacity: 0
                                                }}
                                                id={'userButton' + (index + 1)}
                                                onMouseEnter={() => userOnHover(index + 1)}
                                                onMouseLeave={() => userLeave(index + 1)}
                                                onClick={() => onMakeMainUserButtonClick(userList[index + 1], getPayloadAsJson()!.sub)}
                                            >
                                                    Maak hoofdgebruiker
                                                </Button></> : ''}

                                        </ListItem><Divider /></>
                                    );
                                }
                            })
                            : ''}
                    </List>
                        {getPayloadAsJson()!.type === 'Moderator' ?
                            <List>
                                <ListItem>
                                    <Typography variant="h6" style={{ marginLeft: '130px' }}>
                                        Gebruiker toevoegen:
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <AccountCircle style={{ fontSize: '100px', marginRight: '15px' }} />
                                    <Typography variant="h6">Naam: &emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;&nbsp;<TextField required error={newUserErrorMsg[0] !== ''} helperText={newUserErrorMsg[0]} value={newUserNameInput} onChange={handleInputChangeNewUserName} />
                                        <br /><br />
                                        E-mail: &emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;&nbsp;<TextField required error={newUserErrorMsg[1] !== ''} helperText={newUserErrorMsg[1]} value={newUserEmailInput} onChange={handleInputChangeNewUserEmail} />
                                        <br /><br />
                                        Wachtwoord: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<TextField required type={'password'} error={newUserErrorMsg[2] !== ''} helperText={newUserErrorMsg[2]} value={newUserPassInput} onChange={handleInputChangeNewUserPass} />
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <Button variant="contained" color="primary" style={{ marginLeft: '175px', marginTop: '30px' }} onClick={() => {OnAddNewUserButtonClick(setnewUserPassInput, setnewUserEmailInput, setNewUserNameInput, setUserList, setnewUserErrorMsg, newUserNameInput, newUserEmailInput, newUserPassInput);}}>
                                        Toepassen
                                    </Button>
                                </ListItem>
                                <Divider />
                            </List> : ''}                   
                </Box> : mainPage(queryParamsObject, imageList, isModerator, setImageList, stylesFotoLib, false)}                         
            </div>
        </React.Fragment>
    );
}

function fileNameValidation(fileName: string) {
    const FileNameArray = fileName.split('.');
    const newFileName = FileNameArray[0];
    return newFileName.indexOf(' ') >= 0;
}

async function changeNameOrEmail(newName: string, newEmail: string, changeName: boolean, changeEmail: boolean, setChangeUserDataErrorMsg: any) {
    setChangeUserDataErrorMsg([changeName && newEmail === '' ? 'Dit veld is verplicht' : '', changeEmail && newEmail === '' ? 'newEmail' : '']);

    if (changeName && newName === '' || changeEmail && newEmail === '') return;

    const ApiInstance = new Api(getToken()!);
    let result = [];
    if (changeName) {       
        result = await ApiInstance.update('user', getPayloadAsJson()!.sub,
            [
                getPayloadAsJson()!.email,
                null,
                getPayloadAsJson()!.type === 'Moderator' ? '2' : '3',
                newName,
                getPayloadAsJson()!.company.toString(),
            ]);
    }
    else if (changeEmail) {
        result = await ApiInstance.update('user', getPayloadAsJson()!.sub,
            [
                newEmail,
                null,
                getPayloadAsJson()!.type === 'Moderator' ? '2' : '3',
                getPayloadAsJson()!.naam,
                getPayloadAsJson()!.company.toString(),
            ]);
    }

    document.cookie = document.cookie.substring(document.cookie.indexOf('token='), 6);
    window.location.replace('/');
}

async function OnAddNewUserButtonClick(setnewUserPassInput: any, setnewUserEmailInput: any, setNewUserNameInput: any, setUserList: any, setnewUserErrorMsg: any, newUserName: string, newUserEmail: string, NewUserPass: string) {
    const ApiInstance = new Api(getToken()!);
    setnewUserErrorMsg([newUserName === '' ? 'Dit veld is verplicht' : '',
        newUserEmail === '' ? 'Dit veld is verplicht' : newUserEmail.indexOf('@') === undefined ? 'U moet wel een geldig email adres invoeren' : '',
        NewUserPass === '' ? 'Dit veld is verplicht' : '']);

    if (['!', '@', '#', '$', '%', '^', '&', ' *', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', `|`, ';', ':', "'", '"', ',', '<', '.', '>', '/', '?', '`', '~'].some(s => NewUserPass.includes(s)) &&
        ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].some(s => NewUserPass.includes(s)) && NewUserPass.length > 7 &&
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].some(s => NewUserPass.includes(s)) &&
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].some(s => NewUserPass.includes(s.toUpperCase()))) {

        let userListDb = []
        if (typeof (userListDb = await ApiInstance.all('user')) === undefined) {
            window.alert('De verbinding met de database is verbroken. Probeer het later opnieuw.');
            return;
        };

        if (Enumerable.from(User.makeUserArray((await ApiInstance.all('user')).content)).select(u => u.Email).contains(newUserEmail)) {
            setnewUserErrorMsg(['', 'Dit email adres bestaat al.', '']);
            return;
        }

        let result = [];
        if (typeof (result = await ApiInstance.create('user',
            [
                newUserEmail,
                NewUserPass,
                '3',
                newUserName,
                getPayloadAsJson()!.company.toString(),
            ])) === undefined) {
            window.alert('Kan de gebruiker niet opslaan.');
            return;
        };

        setUserList(await getUsers());
        setNewUserNameInput('');
        setnewUserEmailInput('');
        setnewUserPassInput('');
        return;
    }
    setnewUserErrorMsg(['', '', 'Het wachtwoord voldoet niet aan de minimale eisen.']);
}

export async function getDesigns() {
    const ApiInstance = new Api(getToken()!);
    let designListDb = [];
    let templateListDb = [];

    if (typeof (designListDb = await ApiInstance.all('design')) === 'undefined') {
        window.alert('De verbinding met de database is verbroken. Probeer het later opnieuw.');
        return new Array<Design>();
    }

    if (typeof (templateListDb = await ApiInstance.all('template')) === 'undefined') {
        window.alert('De verbinding met de database is verbroken. Probeer het later opnieuw.');
        return new Array<Design>();
    }
    
    const templateIdList = Enumerable.from(Template.makeTemplateArray(templateListDb.content))
        .where((t) => t.Company_id === getPayloadAsJson()!.company)
        .select((i) => i.Id)
        .toArray();
    let designList = Enumerable.from(Design.makeDesignArray(designListDb.content))
        .where((d) => Enumerable.from(templateIdList).contains(d.Template_id))
        .orderByDescending((d) => d.Updated_at)
        .toArray();

    const designListUpdated = Enumerable.from(designList).where((d) => d.Updated_at.toString() !== 'Invalid Date').orderByDescending((d) => d.Updated_at).toArray();
    const designListNeverUpdated = Enumerable.from(designList).where((d) => d.Updated_at.toString() === 'Invalid Date').toArray();
    designList = designListUpdated.concat(designListNeverUpdated);

    return designList;
}

export async function getTemplates() {
    const ApiInstance = new Api(getToken()!);
    const user = getPayloadAsJson()!;
    let templateListDb = [];
    if (typeof (templateListDb = await ApiInstance.all('template')) === 'undefined') {
        window.alert('De verbinding met de database is verbroken. Probeer het later opnieuw.');
        return new Array<Template>();
    }

    let templateList = Enumerable.from(Template.makeTemplateArray(templateListDb.content))
        .where((t) => t.Company_id === user.company)
        .toArray();

    return templateList;
}

async function getUsers() {
    const ApiInstance = new Api(getToken()!);
    let userDataDb = [];
    if (typeof (userDataDb = await ApiInstance.all('user')) === 'undefined') {
        window.alert('De verbinding met de database is verbroken. Probeer het later opnieuw.');
        return new Array<User>();
    }

    const allUsers = User.makeUserArray(userDataDb.content);
    let usersOfCompany = new Array<User>();
    for (let userIndex = 0; userIndex < allUsers.length; userIndex++) {
        if (
            allUsers[userIndex].Company_Id === getPayloadAsJson()!.company &&
            allUsers[userIndex].Email !== getPayloadAsJson()!.email
        ) {
            usersOfCompany.push(allUsers[userIndex]);
        }
    }
    return usersOfCompany;
}

async function makeInfoViewBoolList() {
    const designList = await getDesigns();
    if (typeof designList === 'undefined') return new Array<boolean>();
    const boolList = [];
    for (var a = 0; a < designList.length; a++) {
        boolList.push(false);
    }

    return boolList;
}

export async function onMakeMainUserButtonClick(user: User, currentUserId: number) {
    const ApiInstance = new Api(getToken()!);
    let userDataDb = [];
    if (typeof (userDataDb = await ApiInstance.read('user', currentUserId)) === 'undefined' || userDataDb.status === 'FAIL') {
        window.alert('De verbinding met de database is verbroken. Probeer het later opnieuw.');
        return;
    }

    let result = [];
    if (typeof (result = await ApiInstance.update('user', currentUserId,
        [
            userDataDb.content[0].Email,
            null,
            3,
            userDataDb.content[0].Name,
            userDataDb.content[0].Company_Id
        ])) === 'undefined') {
        window.alert(
            'De verbinding met de database is verbroken. Probeer het later opnieuw.'
        );
        return;
    }

    if (typeof (result = await ApiInstance.update('user', user.Id,
        [
            user.Email,
            null,
            '2',
            user.Name,
            user.Company_Id.toString()
        ])) === 'undefined') {
        window.alert(
            'De verbinding met de database is verbroken. Probeer het later opnieuw.'
        );
        return;
    }

    document.cookie = document.cookie.substring(document.cookie.indexOf('token='), 6);
    window.location.replace('/');
}

function makeNewInfoViewBoolList(index: number, designList: Array<Design>, infoView: Array<Boolean>) {
    const boolList = [];
    for (var a = 0; a < designList.length; a++) {
        if (a === index) {
            boolList.push(!infoView[index]);
            continue;
        }
        boolList.push(false);
    }

    return boolList;
}

function userOnHover(id: number) {
    const userField = 'userField' + id;
    const userButtonId = 'userButton' + id;
    document.getElementById(userField)!.style.filter = 'blur(4px)';
    document.getElementById(userField)!.style.transition = '1s';
    document.getElementById(userButtonId)!.style.transition = '1s';
    document.getElementById(userButtonId)!.style.opacity = '1';
    document.getElementById(userButtonId)!.style.top =
        String(parseInt(document.getElementById(userField)!.style.height) / 1.5) + 'px';
    document.getElementById(userButtonId)!.style.left =
        String(parseInt(document.getElementById(userField)!.style.height) / 7) + 'px';
}

function userLeave(id: number) {
    const userField = 'userField' + id;
    const userButtonId = 'userButton' + id;
    document.getElementById(userField)!.style.filter = 'none';
    document.getElementById(userButtonId)!.style.opacity = '0';
}

export async function ChangePass(setCurrentPassInput: any, setConfirmPassInput: any, setNewPassInput: any, userId: number, currentPass: string, newPass: string, confirmPass: string, setPassError: any) {
    const ApiInstance = new Api(getToken()!);
    const validation = (await ApiInstance.verifyPassword(getPayloadAsJson()!.email, currentPass)).content.valid;

    setPassError([
        currentPass === '' ? 'Dit veld is verplicht' : !validation ? 'Het wachtwoord is onjuist' : '',
        newPass === '' ? 'Dit veld is verplicht' : '',
        confirmPass === '' ? 'Dit veld is verplicht' : newPass === '' ? 'U heeft geen nieuw wachtwoord opgegeven' : newPass !== confirmPass ? 'Wachtwoorden zijn ongelijk' : ''
    ]);

    // check for password format; minimaal 8 tekens, 1+ hoofdletter, 1+ cijfer & 1+ speciaal teken
    if (newPass !== confirmPass || !validation) return;

    if (['!', '@', '#', '$', '%', '^', '&', ' *', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', `|`, ';', ':', "'", '"', ',', '<', '.', '>', '/', '?', '`', '~'].some(s => newPass.includes(s)) &&
        ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].some(s => newPass.includes(s)) && newPass.length > 7 &&
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].some(s => newPass.includes(s)) &&
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].some(s => newPass.includes(s.toUpperCase()))) {        
        let userDataDb = [];
        if (typeof (userDataDb = await ApiInstance.read('user', userId)) === 'undefined') {
            window.alert('De verbinding met de database is verbroken. Probeer het later opnieuw.');
            return;
        }
        let result = [];
        console.log('updating...');
        if (typeof (result = await ApiInstance.update('user', userId,
            [
                userDataDb.content[0].Email,
                newPass,
                userDataDb.content[0].Role_Id,
                userDataDb.content[0].Name,
                userDataDb.content[0].Company_Id
            ])) === 'undefined') {
            window.alert(
                'De verbinding met de database is verbroken. Probeer het later opnieuw.'
            );

            setNewPassInput('');
            setConfirmPassInput('');
            setCurrentPassInput('');
            return;
        }
    }
    else {
        setPassError(['',
            'Het wachtwoord voldoet niet aan de minimale eisen.',
            'Het wachtwoord voldoet niet aan de minimale eisen.'
        ]);
        return;
    }

    document.cookie = document.cookie.substring(document.cookie.indexOf('token='), 6);
    window.location.replace('/');
}

export default CreateExport('/user-portal', UserPortal);
