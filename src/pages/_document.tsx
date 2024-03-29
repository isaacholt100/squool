import React from "react";
import Document, {
    Html, Main, NextScript, Head
} from "next/document";
import { ServerStyleSheets } from "@material-ui/core/styles";
import cookies from "next-cookies";
import { DEFAULT_THEME_ROUTES } from "../context/Theme";

const
    APP_NAME = "Squool",
    APP_DESC = "<Description Here>",
    APP_URL = "https://squool.vercel.app",
    APP_COLOR = "#000000";

export default class MyDocument extends Document {
    render() {
        const fontFamilyLink = (this.props as any).fontFamily ? `https://fonts.googleapis.com/css?family=${(this.props as any).fontFamily.toLowerCase().split(" ").map((s: string) => s.charAt(0).toUpperCase() + s.substring(1)).join("+")}:300,400,500,700&display=swap` : undefined;
        return (
            <Html lang="en">
                <Head>
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    {fontFamilyLink && <link rel="stylesheet" href={fontFamilyLink} />}
                    <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-icon-180x180.png" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
                    <link rel="manifest" href="/manifest.json" />
                    <link rel="manifest" href="/site.webmanifest" />
                    <link rel="mask-icon" href="/icons/apple-icon-180x180.png" color="#000000" />
                    <link rel="shortcut icon" href="/icons/favicon.ico" />

                    <meta name="application-name" content={APP_NAME} />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                    <meta name="apple-mobile-web-app-title" content={APP_NAME} />
                    <meta name="description" content={APP_DESC} />
                    <meta name="format-detection" content="telephone=no" />
                    <meta name="mobile-web-app-capable" content="yes" />
                    <meta name="msapplication-config" content="/browserconfig.xml" />
                    <meta name="msapplication-TileColor" content="#000000" />
                    <meta name="msapplication-tap-highlight" content={APP_COLOR} />
                    <meta name="theme-color" content={APP_COLOR} />

                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:url" content={APP_URL} />
                    <meta name="twitter:title" content={APP_NAME} />
                    <meta name="twitter:description" content={APP_DESC} />
                    <meta name="twitter:image" content={APP_URL + "/icons/android-icon-192x192.png"} />
                    {/*<meta name="twitter:creator" content="@DavidWShadow" />*/}
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={APP_NAME} />
                    <meta property="og:description" content={APP_DESC} />
                    <meta property="og:site_name" content={APP_NAME} />
                    <meta property="og:url" content={APP_URL} />
                    <meta property="og:image" content={APP_URL + "/icons/apple-icon.png"} />
                    <meta charSet="utf-8" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="keywords" content="<Keywords here>" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
MyDocument.getInitialProps = async ctx => {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;
    //const cookiesObj = cookies(ctx);
    ctx.renderPage = () => originalRenderPage({
        enhanceApp: App => props => {
            /*const initialTheme = DEFAULT_THEME_ROUTES.includes(props.router.route) ? {} : {
                fontFamily: cookiesObj.theme_fontFamily,
                primary: cookiesObj.theme_primary,
                secondary: cookiesObj.theme_secondary,
                type: cookiesObj.theme_type,
            };
            props.pageProps.initialTheme = initialTheme;*/
            return sheets.collect(<App {...props} />);
        },
    });
    const initialProps = await Document.getInitialProps(ctx);
    return {
        ...initialProps,
        styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
    };
};