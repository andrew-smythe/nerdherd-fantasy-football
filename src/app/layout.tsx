import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import theme from '@/theme';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Copyright from '@/components/Copyright';
import Navigation from '@/components/Navigation';

export default function RootLayout(props: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <InitColorSchemeScript attribute="class" />
                <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                    <ThemeProvider theme={theme}>
                        <Container maxWidth={false} disableGutters>
                            <Box sx={{ display: 'flex' }}>
                                <CssBaseline />
                                <Navigation />
                                <Box component="main" sx={{ flexGrow: 1, p: 3}}>
                                    <Toolbar />
                                    {props.children}
                                    <Copyright />
                                </Box>
                            </Box>
                        </Container>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
