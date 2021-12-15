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
    
} from '@material-ui/core';
import {
    AccountCircle, 
    BorderBottom,

} from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import Enumerable from 'linq';

function UserPortalSettings() {
    const user = getPayloadAsJson();
    const theme = useTheme();
    const [openDrawer, setOpenDrawer] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [pass, setPass] = React.useState();
    
    React.useEffect(() => {
        (async () => {
            setPass(await GetUserPassword(user));
        })();
    }, []);

    console.log(user);
    return(
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
                                        window.close();
                                    }}
                                >
                                    Pagina sluiten
                                </Button>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </Box>
            <div style={{ display: 'flex', marginTop: '70px', marginLeft: '10px', marginRight: '10px', justifyContent: "center" }} id="userPortalMainPage" anchorEl={anchorEl}>
                <List alignItems='center' width='85%'>
                    <ListItem style={{ paddingLeft: '200px', paddingRight: '200px' }}>
                        <AccountCircle style={{ fontSize: '170px', marginRight: '15px' }}/>
                        <Typography variant='h6'>
                            {user.naam}
                            <br />
                            {user.email}
                        </Typography>
                    </ListItem>
                    <Divider />
                </List>
                <List alignItems='center' width='85%' marginTop='70px'>
                    <ListItem>
                        <Typography variant='h6'>
                            {'Naam: '}
                            {user.naam}
                        </Typography>
                        
                    </ListItem>
                    <ListItem>
                        <Typography variant='h6'>
                            {pass}
                        </Typography>
                    </ListItem>
                </List>
            </div>
        </React.Fragment>
    );
}

export default CreateExport('/user-portal-settings', UserPortalSettings);

async function GetUserPassword(userInstance) {
    let userListDb = [];
    const ApiInstance = new Api(getToken());
    if (typeof (userListDb = await ApiInstance.all('user')) === 'undefined') {
        window.alert('De verbinding met de database is verbroken. Probeer het later opnieuw.');
        return;
    }
    console.log(userListDb.content);
    let userPassword = Enumerable.from(userListDb.content).where((u) => u.Email === userInstance.email).toArray()[0];
    console.log(userPassword);
    return userPassword//.Password;
}