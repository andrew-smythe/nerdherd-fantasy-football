import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Link from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import Copyright from '@/components/Copyright';
import ModeSwitch from '@/components/ModeSwitch';

export default function Home() {
    return (
        <Container maxWidth={false} disableGutters>
            <Box>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Nerdherd Fantasy Football
                        </Typography>
                        <ModeSwitch />
                    </Toolbar>
                </AppBar>
                <Copyright />
            </Box>
        </Container>
    );
}
