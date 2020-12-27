import { memo } from "react";
import { Prism as SyntaxHighlighter, SyntaxHighlighterProps } from "react-syntax-highlighter";
//import dark from "react-syntax-highlighter/dist/esm/styles/prism/vs-dark";
//import light from "react-syntax-highlighter/dist/esm/styles/prism/vs";
import { makeStyles } from "@material-ui/core";
import { useTheme } from "../../context/Theme";

interface IProps {
    height?: number | string;
    maxHeight?: number | string;
    code: string;
}

const useStyles = makeStyles(theme => ({
    pre: {
        p: "8px !important",
        margin: "0px !important",
        backgroundColor: (theme.palette.background as any).level1,
        overflow: "auto",
        maxHeight: (props: any) => props.maxHeight,
        height: (props: any) => props.height,
    },
    code: {
        fontFamily: "Inconsolata, Monaco, Consolas, 'Courier New', Courier, monospace !important",
        textShadow: "none !important",
        "& *": {
            textDecoration: "none !important",
        },
        fontSize: 16,
        lineHeight: 1.5,
    },
}));

const Code = memo((props: SyntaxHighlighterProps & IProps) => {
    const classes = useStyles({ maxHeight: props.maxHeight, height: props.height });
    const [{ type: themeType }] = useTheme();
    return (
        <SyntaxHighlighter
            language={props.lang}
            //style={themeType === "light" ? light : dark}
            showLineNumbers={props.showLineNumbers}
            wrapLines={props.wrapLines || true}
            //className="code-pre"
            PreTag={({ children }) => (
                <pre className={classes.pre}>{children}</pre>
            )}
            CodeTag={({ children }) => (
                <code className={classes.code}>{children}</code>
            )}
        >
            {props.code}
        </SyntaxHighlighter>
    );
});
export default Code;