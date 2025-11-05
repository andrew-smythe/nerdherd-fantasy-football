import * as React from 'react';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';

export default function Copyright() {
    return (
        <>
            <Typography
                variant="body2"
                align="center"
                sx={{
                color: 'text.secondary',
                mt: 2,
                }}
            >
                {'Copyright © '}
                Andrew Smythe&nbsp;
                {new Date().getFullYear()}.
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }} align="center">
                Check out the <a href="https://github.com/users/andrew-smythe/projects/1/" target="_blank">Project Page</a>
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }} align="center">
                Or the <a href="https://github.com/andrew-smythe/nerdherd-fantasy-football/" target="_blank">Git Repo</a>
            </Typography>
        </>
    );
}
