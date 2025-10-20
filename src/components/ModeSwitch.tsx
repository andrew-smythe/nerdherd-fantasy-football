'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import DarkMode from '@mui/icons-material/DarkMode';

import { useColorScheme } from '@mui/material/styles';
import { IconButton, Menu } from '@mui/material';

export default function ModeSwitch() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const { mode, setMode } = useColorScheme();

    if (!mode) {
        return null;
    }

    const handleClose = (style: 'light' | 'dark' | 'system' | null) => {
        setMode(style);
        setAnchorEl(null);
    }
    return (
        <div> 
            <IconButton
                size="large"
                aria-label="change theme"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
            >
                <DarkMode />
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={() => handleClose(null)}
            >
                <MenuItem onClick={() => handleClose("system")}>System</MenuItem>
                <MenuItem onClick={() => handleClose("light")}>Light</MenuItem>
                <MenuItem onClick={() => handleClose("dark")}>Dark</MenuItem>
            </Menu>
        </div>
    );
}
