import * as React from 'react';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';

export default function Copyright() {
  return (
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
  );
}
