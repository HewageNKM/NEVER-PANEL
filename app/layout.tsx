"use client";
import {baselightTheme} from "@/utils/theme/DefaultColors";
import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import StoreProvider from "@/components/StoreProvider";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body>
        <StoreProvider>
            <ThemeProvider theme={baselightTheme}>
                <CssBaseline/>
                {children}
            </ThemeProvider>
        </StoreProvider>
        </body>
        </html>
    );
}
