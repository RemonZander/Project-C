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
} from '@material-ui/core';
import { AccountCircle, BorderBottom } from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import Enumerable from 'linq';

function UserPortalSettings() {
    const user = getPayloadAsJson();
    const theme = useTheme();
    const [openDrawer, setOpenDrawer] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [pass, setPass] = React.useState();
    const [userList, setUserList] = useState([]);

    React.useEffect(() => {
        (async () => {
            const ApiInstance = new Api(getToken());

            console.log(user);
            setPass(await GetUserPassword(user));

            const userDataDb = await ApiInstance.all('user');
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
                id="userPortalMainPage"
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
                        style={{ paddingTop: '50px', paddingBottom: '20px', paddingRight: '300px' }}
                    >
                        <Typography variant="h6">
                            {'Naam: '} &emsp;&emsp;&emsp;&nbsp;
                            {user.naam}
                        </Typography>
                    </ListItem>
                    <ListItem style={{ paddingBottom: '50px', paddingRight: '300px' }}>
                        <Typography variant="h6">
                            {'E-mail: '} &emsp;&emsp;&emsp;
                            {user.email}
                        </Typography>
                    </ListItem>
                    <Divider />
                    <ListItem style={{ paddingTop: '50px', paddingRight: '500px' }}>
                        <Typography variant="h6">
                            {'Huidig wachtwoord: '} &emsp;&emsp;
                            {}
                        </Typography>
                    </ListItem>
                    <ListItem style={{ paddingTop: '50px', paddingRight: '500px' }}>
                        <Typography variant="h6">{'Nieuw wachtwoord: '} &emsp;&emsp;</Typography>
                        <TextField required />
                    </ListItem>
                    <ListItem style={{ paddingTop: '50px', paddingRight: '500px' }}>
                        <Typography variant="h6">{'Bevestig wachtwoord: '} &emsp;&emsp;</Typography>
                        <TextField required />
                    </ListItem>
                    <Typography
                        align="center"
                        style={{ paddingTop: '50px', paddingRight: '500px', paddingBottom: '50px' }}
                    >
                        <Button variant="contained" color="primary">
                            Toepassen
                        </Button>
                    </Typography>
                    <Divider />
                </List>
                <List>
                    {user.type === 'Moderator'
                        ? userList.map((user) => {
                              console.log(user);
                              return (
                                  <ListItem>
                                      <AccountCircle style={{ marginRight: '15px' }} />
                                      <Typography variant="h6">
                                          {user.Name}
                                          <br />
                                          {user.Email}
                                      </Typography>
                                  </ListItem>
                              );
                          })
                        : ''}
                </List>
            </Box>
        </React.Fragment>
    );
}

export default CreateExport('/user-portal-settings', UserPortalSettings);

async function GetUserPassword(userInstance) {
    let userDataDb = [];
    const ApiInstance = new Api(getToken());
    if (typeof (userDataDb = await ApiInstance.read('user', userInstance.sub)) === 'undefined') {
        window.alert('De verbinding met de database is verbroken. Probeer het later opnieuw.');
        return;
    }
    // console.log(userDataDb);
    // console.log(userDataDb.content);
    console.log(userInstance);
    return userDataDb.content[0].Password;
}

function HashPassword(password) {
    console.log(password);
    let hashPass = '';
    for (let i = 0; i < password.length; i++) {
        hashPass = hashPass + '*';
    }
    return hashPass;
}
