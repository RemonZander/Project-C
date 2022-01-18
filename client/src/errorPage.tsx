// @ts-nocheck

import * as React from 'react';
import kyndalogo from './kynda.png';
import { Typography, List, ListItem, Box } from '@material-ui/core';
export default function errorPage({ error }) {
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
                    <Typography variant="h5" gutterBottom component="div">Error {error}, {error === 404 ? 'Pagina niet gevonden.' : error === 403 ? 'Geen toegang.' : 'Onbekende fout.'}</Typography>
                </ListItem>
                <ListItem>
                    <div>
                        <Typography variant="body1" gutterBottom component="div">{error === 404 ? `De URL ${window.location.href} us bij ons onbekent.` : error === 403 ? `U heeft geen toegang tot de URL ${window.location.href}.` : `Er is iets fout gegaan en deze error is bij ons niet bekent.`}</Typography>
                        <Typography variant="body2" gutterBottom component="div"><a href="/">klik hier om terug te gaan naar de home pagina.</a></Typography>
                    </div>
                </ListItem>
            </List>
        </Box>
        )
}