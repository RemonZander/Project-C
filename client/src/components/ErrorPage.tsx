// @ts-nocheck
import kyndalogo from '../kynda.png';
import { Typography, List, ListItem, Box } from '@material-ui/core';

export default function ErrorPage(props: { error: number }) {
    return (
        <Box
            sx={{
                display: 'flex',
                marginTop: '30vh',
                alignItems: 'center',
                flexDirection: 'column',
            }}>
            <List>
                <ListItem>
                    <img src={kyndalogo} alt="kynda logo" width="200" height="67" />
                </ListItem>
                <ListItem>
                    <Typography variant="h5" gutterBottom component="div">Error {props.error}, {props.error === 404 ? 'Pagina niet gevonden.' : props.error === 403 ? 'Geen toegang.' : 'Onbekende fout.'}</Typography>
                </ListItem>
                <ListItem>
                    <div>
                        <Typography variant="body1" gutterBottom component="div">{props.error === 404 ? `De URL ${window.location.href} is bij ons onbekend.` : props.error === 403 ? `U heeft geen toegang tot de URL ${window.location.href}.` : `Er is iets fout gegaan en deze error is bij ons niet bekend.`}</Typography>
                        <Typography variant="body2" gutterBottom component="div"><a href="/" onClick={() => { logout(); }}>Klik hier om terug te gaan naar de login pagina.</a></Typography>
                    </div>
                </ListItem>
            </List>
        </Box>
    )

    function logout() {
        if (props.error !== 403) {
            return;
        }
        document.cookie = document.cookie.substring(
            document.cookie.indexOf('token='),
            6
        );
        window.location.replace('/');
    }
}