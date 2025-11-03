'use client';
import * as React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FootballIcon from '@mui/icons-material/SportsFootball';
import InfoIcon from '@mui/icons-material/Info';
import FightIcon from '@mui/icons-material/SportsMma';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ListButtonLink from '@/components/ListButtonLink';
import { 
    AppBar, Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, 
    ListItemIcon, ListItemText, Toolbar, Typography 
} from '@mui/material';
import ModeSwitch from '@/components/ModeSwitch';

export default function Navigation() {

    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = function() {
        if (open) {
            setDrawerWidth(0);
        }
        else {
            setDrawerWidth(270);
        }
        setOpen(!open);
    }

    const [drawerWidth, setDrawerWidth] = React.useState(0);

    const navigation = [
        {
            text: "Home",
            icon: <HomeIcon />,
            to: "/",
        },
        {
            text: "League History",
            icon: <EmojiEventsIcon />,
            to: "/history",
        },
        {
            text: "Matchup History",
            icon: <FootballIcon />,
            to: "/matchups",
        },
        {
            text: "Head to Head Records",
            icon: <FightIcon />,
            to: "/headtohead",
        },
        {
            text: "League Records",
            icon: <MenuBookIcon />,
            to: "/records",
        },
        {
            text: "About",
            icon: <InfoIcon />,
            to: "/about",
        },

    ];

    const navList = [];
    
    for (let i in navigation) {
        navList.push(
            <ListItem disablePadding key={"navListItem"+i}>
                <ListButtonLink 
                    icon={navigation[i].icon}
                    text={navigation[i].text}
                    to={navigation[i].to}
                    key={"navLink"+i}
                />
            </ListItem>
        );
    }

    return (
        <>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1}}>
                <Toolbar>
                    <IconButton 
                        edge="start" 
                        color="inherit" 
                        aria-label="menu" 
                        sx={{ mr: 2 }}
                        onClick={handleDrawerOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Nerdherd Fantasy Football
                    </Typography>
                    <ModeSwitch />
                </Toolbar>
            </AppBar>
            <Drawer
                variant="persistent"
                open={open}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    transition: 'width 225ms cubic-bezier(0, 0, 0.2, 1)',
                }}
            >
                <Toolbar />
                <Box>
                    <List>{navList}</List>
                </Box>
            </Drawer>
        </>
    );
}