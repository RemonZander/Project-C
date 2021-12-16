import * as React from 'react';
import kyndalogo from './kynda.png';
import { CreateExport } from '../../helpers/Export';
import Api from '../../helpers/Api';
import { getPayloadAsJson, getToken } from '../../helpers/Token';
import {
    Typography,
    AppBar,
    Button,
    Card,
    CardContent,
    CardMedia,
    CssBaseline,
    Grid,
    IconButton,
    Menu as MenuIcon,
    Box,
    Toolbar,
    List,
    ListItem,
    Divider,
    TextField,
    Container
} from '@material-ui/core';
import { AccountCircle, BorderBottom, Security, SquareFoot } from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import Enumerable from 'linq';
import { red } from '@material-ui/core/colors';

function UserPortalSettings() {
    const user = getPayloadAsJson();
    const theme = useTheme();
    const [openDrawer, setOpenDrawer] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [pass, setPass] = React.useState();

    const [currentPassInput, setCurrentPassInput] = React.useState('');
    const [newPassInput, setNewPassInput] = React.useState('');
    const [confirmPassInput, setConfirmPassInput] = React.useState('');
    const [passErrorMsg, setPassErrorMsg] = React.useState(['', '', '']);

    const [userList, setUserList] = useState([]);

    const handleInputChangeCurrentPass = (event) => {
        setCurrentPassInput(event.target.value);
    };

    const handleInputChangeNewPass = (event) => {
        setNewPassInput(event.target.value);
    };

    const handleInputChangeConfirmPass = (event) => {
        setConfirmPassInput(event.target.value);
    };

    React.useEffect(() => {
        (async () => {
            const ApiInstance = new Api(getToken());

            setPass(await GetUserPassword(user));

            let userDataDb = [];

            if (typeof(userDataDb = await ApiInstance.all('user')) === 'undefined') {
                window.alert('De verbinding met de database is verbroken. Probeer het later opnieuw.');
                return;
            }
            const allUsers = userDataDb.content;
            let usersOfCompany = [];
            for (let userIndex = 0; userIndex < allUsers.length; userIndex++) {
                if (
                    allUsers[userIndex].Company_Id === user.company &&
                    allUsers[userIndex].Email !== user.email
                ) {
                    usersOfCompany.push(allUsers[userIndex]);
                }
            }
            setUserList(usersOfCompany);
        })();
    }, []);

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
                        <img
                            src={kyndalogo}
                            alt="kynda logo"
                            width="90"
                            height="30"
                            style={{ marginRight: '20px', marginLeft: '10px' }}
                        />
                        <Typography variant="h5" style={{ color: 'black' }}>
                            User
                        </Typography>
                        <Typography variant="h5" style={{ color: 'black', marginLeft: '6px' }}>
                            portal
                        </Typography>
                        <Typography variant="h5" style={{ color: 'black', marginLeft: '6px' }}>
                            instellingen
                        </Typography>
                        <Grid container spacing={2} justifyContent="flex-end">
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        window.open('/user-portal', '_self');
                                    }}
                                >
                                    Pagina sluiten
                                </Button>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    marginTop: '70px',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
                id="userPortalSettingsPage"
                anchorEl={anchorEl}
            >
                <List alignItems="center">
                    <ListItem style={{ paddingLeft: '200px', paddingRight: '200px' }}>
                        <AccountCircle style={{ fontSize: '170px', marginRight: '15px' }} />
                        <Typography variant="h6">
                            {user.naam}
                            <br />
                            {user.email}
                        </Typography>
                    </ListItem>
                    <Divider />
                </List>
                <List>
                    <ListItem
                        style={{ paddingTop: '50px', paddingBottom: '20px', paddingLeft: '200px', paddingRight: '200px' }}
                    >
                        <Typography variant="h6">
                            {'Naam: '} &emsp;&emsp;&emsp;&nbsp;
                            {user.naam}
                        </Typography>
                    </ListItem>
                    <ListItem style={{ paddingBottom: '50px', paddingLeft: '200px', paddingRight: '200px' }}>
                        <Typography variant="h6">
                            {'E-mail: '} &emsp;&emsp;&emsp;
                            {user.email}
                        </Typography>
                    </ListItem>
                    <Divider />
                    <ListItem style={{ paddingTop: '50px', paddingLeft: '200px', paddingRight: '200px' }}>
                        <Typography variant="h6">
                            {'Huidig wachtwoord: '} &emsp;&emsp;&emsp;
                            <TextField required error={passErrorMsg[0] !== ''} helperText={passErrorMsg[0]} type={'password'} style={{ Security: 'square' }} value={currentPassInput} onChange={handleInputChangeCurrentPass}  />
                        </Typography>
                    </ListItem>
                    <ListItem style={{ paddingTop: '50px', paddingLeft: '200px', paddingRight: '200px' }}>
                        <Typography variant="h6">{'Nieuw wachtwoord: '} &emsp;&emsp;&emsp;</Typography>
                        <TextField required error={passErrorMsg[1] !== ''} helperText={passErrorMsg[1]} type={'password'} style={{ Security: 'square' }} value={newPassInput} onChange={handleInputChangeNewPass}  />
                    </ListItem>
                    <ListItem style={{ paddingTop: '50px', paddingLeft: '200px', paddingRight: '200px' }}>
                        <Typography variant="h6">{'Bevestig wachtwoord: '} &emsp;&emsp;</Typography>
                        <TextField id="confirmPass" required error={passErrorMsg[2] !== ''} helperText={passErrorMsg[2]} type={'password'} style={{ Security: 'square' }} value={confirmPassInput} onChange={handleInputChangeConfirmPass}  />
                    </ListItem>
                    <Typography
                        align="center"
                        style={{ paddingTop: '50px', paddingBottom: '50px', paddingLeft: '200px', paddingRight: '200px' }}
                    >
                        <Button variant="contained" color="primary" onClick={() => {
                            ChangePass(user.sub, pass, currentPassInput, newPassInput, confirmPassInput, setPassErrorMsg);
                        }}>
                            Toepassen
                        </Button>
                    </Typography>
                    <Divider />
                </List>
                <List>
                    {user.type === 'Moderator' ? <ListItem style={{ alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                            <Typography variant="h6">
                            Hieronder kunt u een gebruiker selecteren om hoofdgebruiker te maken.<br />
                            Er kan maar een hoofdgebruiker zijn. Dit betekent dat <br/>het huidige hoofdgebruiker account een normale gebruiker wordt.
                            </Typography>
                        </ListItem> : ''}
                    {user.type === 'Moderator'
                        ? userList.map((user, index) => {
                            if (index % 2 === 0) {
                                console.log(index + ' ' + userList.length);
                            return (
                                <><ListItem style={{ alignItems: 'center', justifyContent: 'center', marginRight: '50px'}}>
                                    {index === userList.length - 1 && userList.length % 2 !== 0 ? <><ListItem id={'userField' + index} style={{ alignItems: 'center', width: '50%' }}
                                        onMouseEnter={() => userOnHover(index)}
                                        onMouseLeave={() => userLeave(index)}>
                                        <AccountCircle style={{ fontSize: '60px', marginRight: '15px' }} />
                                        <Typography variant="h6">
                                            {userList[index].Name}
                                            <br />
                                            {userList[index].Email}
                                        </Typography>
                                    </ListItem><Button
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
                                        onClick={() => onMakeMainUserButtonClick(user, getPayloadAsJson().sub)}
                                    >
                                            Maak hoofdgebruiker
                                        </Button></> : <><ListItem id={'userField' + index} style={{ alignItems: 'center', width: '50%' }}
                                            onMouseEnter={() => userOnHover(index)}
                                            onMouseLeave={() => userLeave(index)}>
                                            <AccountCircle style={{ fontSize: '60px', marginRight: '15px' }} />
                                            <Typography variant="h6">
                                                {userList[index].Name}
                                                <br />
                                                {userList[index].Email}
                                            </Typography>
                                        </ListItem><Button
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
                                            onClick={() => onMakeMainUserButtonClick(user, getPayloadAsJson().sub)}
                                        >
                                                Maak hoofdgebruiker
                                            </Button></>}
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
                                        onClick={() => onMakeMainUserButtonClick(userList[index + 1], getPayloadAsJson().sub)}
                                    >
                                            Maak hoofdgebruiker
                                        </Button></> : ''}
                                    
                                    </ListItem><Divider /></>
                            );
                        }
                        })
                        : ''}
                </List>
                <Typography variant="h6">
                    Gebruiker toevoegen:
                </Typography>
                <List>
                    <ListItem>
                        <AccountCircle style={{ fontSize: '100px', marginRight: '15px' }} />
                        <div style={{fontSize: '20px'}}>Naam: <TextField required /><br/>
                            Email: <TextField required /><br/>
                            Wachtwoord: <TextField required />
                        </div>
                    </ListItem>
                </List>
            </Box>
        </React.Fragment>
    );
}

export default CreateExport('/user-portal-settings', UserPortalSettings);

async function onMakeMainUserButtonClick(user, currentUserId) {
    const ApiInstance = new Api(getToken());
    let userDataDb = [];
    if (typeof (userDataDb = await ApiInstance.read('user', currentUserId)) === 'undefined' || userDataDb.status === 'FAIL') {
        window.alert('De verbinding met de database is verbroken. Probeer het later opnieuw.');
        return;
    }

    let result = [];
    if (typeof (result = await ApiInstance.update('user', currentUserId,
        [
            userDataDb.content[0].Email,
            userDataDb.content[0].Password,
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
            user.Password,
            2,
            user.Name,
            user.Company_Id
        ])) === 'undefined') {
        window.alert(
            'De verbinding met de database is verbroken. Probeer het later opnieuw.'
        );
        return;
    }

    document.cookie = document.cookie.substring(document.cookie.indexOf('token='), 6);
    window.location.replace('/').focus();
}

function userOnHover(id) {
    const userField = 'userField' + id;
    const userButtonId = 'userButton' + id;
    document.getElementById(userField).style.filter = 'blur(4px)';
    document.getElementById(userField).style.transition = '1s';
    document.getElementById(userButtonId).style.transition = '1s';
    document.getElementById(userButtonId).style.opacity = '1';
    document.getElementById(userButtonId).style.top =
        String(document.getElementById(userField).height / 1.5) + 'px';
    document.getElementById(userButtonId).style.left =
        String(document.getElementById(userField).width / 7) + 'px';
}

function userLeave(id) {
    const userField = 'userField' + id;
    const userButtonId = 'userButton' + id;
    document.getElementById(userField).style.filter = 'none';
    document.getElementById(userButtonId).style.opacity = '0';
}

async function GetUserPassword(userInstance) {
    let userDataDb = [];
    const ApiInstance = new Api(getToken());
    if (typeof (userDataDb = await ApiInstance.read('user', userInstance.sub)) === 'undefined') {
        window.alert('De verbinding met de database is verbroken. Probeer het later opnieuw.');
        return;
    }
    return userDataDb.content[0].Password;
}

async function ChangePass(userId, userPassword, currentPass, newPass, confirmPass, setPassError) {
    setPassError([
        currentPass === '' ? 'Dit veld is verplicht' : currentPass !== userPassword ? 'Het wachtwoord is onjuist' : '', 
        newPass === '' ? 'Dit veld is verplicht' : '', 
        confirmPass === '' ? 'Dit veld is verplicht' : newPass === '' ? 'U heeft geen nieuw wachtwoord opgegeven' : newPass !== confirmPass ? 'Wachtwoorden zijn ongelijk' : ''
    ]);


    // check for password format; minimaal 8 tekens, 1+ hoofdletter, 1+ cijfer & 1+ speciaal teken
    if (newPass !== confirmPass || currentPass !== userPassword) return;

    if (['!', '@', '#', '$', '%', '^', '&', ' *', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', `|`, ';', ':', "'", '"', ',', '<', '.', '>', '/', '?', '`', '~'].some(s => newPass.includes(s)) &&
        ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].some(s => newPass.includes(s)) && newPass.length > 7) {
        console.log('succes');
        const ApiInstance = new Api(getToken());
        let userDataDb = [];
        if (typeof (userDataDb = await ApiInstance.read('user', userId)) === 'undefined') {
            window.alert('De verbinding met de database is verbroken. Probeer het later opnieuw.');
            return;
        }
        let result = [];
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
            return;
        }
    }
    else {
        console.log('fail');
    }

}