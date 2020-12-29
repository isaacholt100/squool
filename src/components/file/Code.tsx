import { memo } from "react";
import { PrismAsyncLight as SyntaxHighlighter, SyntaxHighlighterProps } from "react-syntax-highlighter";
//import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
//import dark from "react-syntax-highlighter/dist/esm/styles/prism/vs-dark";
//import light from "react-syntax-highlighter/dist/esm/styles/prism/vs";
import { makeStyles } from "@material-ui/core";
//import { useTheme } from "../../context/Theme";

interface IProps {
    height?: number | string;
    maxHeight?: number | string;
    code: string;
}

const useStyles = makeStyles(theme => ({
    pre: {
        padding: "8px 16px !important",
        margin: "0px !important",
        borderRadius: 16,
        backgroundColor: (theme.palette.background as any).paper,
        color: theme.palette.text.primary,
        overflow: "auto",
        maxHeight: (props: any) => props.maxHeight,
        height: (props: any) => props.height,
        fontFamily: "Inconsolata, Monaco, Consolas, 'Courier New', Courier, monospace",
        whiteSpace: "pre-wrap",
        "textShadow": "none",
        "direction": "ltr",
        "textAlign": "left",
        "wordSpacing": "normal",
        "wordBreak": "normal",
        "lineHeight": "2",
        "MozTabSize": "4",
        "OTabSize": "4",
        "tabSize": "4",
        "WebkitHyphens": "none",
        "MozHyphens": "none",
        "msHyphens": "none",
        "hyphens": "none",
        "& .comment": {
            "color": "#6a9955"
        },
        "& .prolog": {
            "color": "#6a9955"
        },
        "& .doctype": {
            "color": "#6a9955"
        },
        "& .cdata": {
            "color": "#6a9955"
        },
        "& .punctuation": {
            "color": "#569cd6"
        },
        "& .namespace": {
            "opacity": 0.7
        },
        "& .property": {
            "color": "#ce9178"
        },
        "& .keyword": {
            "color": "#569cd6"
        },
        "& .tag": {
            "color": "#569cd6"
        },
        "& .class-name": {
            "color": "#FFFFB6",
            "textDecoration": "underline"
        },
        "& .boolean": {
            "color": "#99CC99"
        },
        "& .constant": {
            "color": "#99CC99"
        },
        "& .symbol": {
            "color": "#f92672"
        },
        "& .deleted": {
            "color": "#ce9178"
        },
        "& .number": {
            "color": "#FF73FD"
        },
        "& .selector": {
            "color": "#A8FF60"
        },
        "& .attr-name": {
            "color": "@"
        },
        "& .string": {
            "color": "#ce9178"
        },
        "& .char": {
            "color": "#A8FF60"
        },
        "& .builtin": {
            "color": "#569cd6"
        },
        "& .inserted": {
            "color": "#A8FF60"
        },
        "& .variable": {
            "color": "#C6C5FE"
        },
        "& .operator": {
            "color": "##ce9178"
        },
        "& .entity": {
            "color": "#FFFFB6",
            "cursor": "help"
        },
        "& .url": {
            "color": "#96CBFE"
        },
        "&.language-css .token.string": {
            "color": "#99CC99"
        },
        "&.style .token.string": {
            "color": "#99CC99"
        },
        "& .atrule": {
            "color": "#F9EE98"
        },
        "& .attr-value": {
            "color": "#F9EE98"
        },
        "& .function": {
            "color": "#569cd6"
        },
        "& .regex": {
            "color": "#E9C062"
        },
        "& .important": {
            "color": "#fd971f",
            "fontWeight": "bold"
        },
        "& .bold": {
            "fontWeight": "bold"
        },
        "& .italic": {
            "fontStyle": "italic"
        }
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
    //const [{ type: themeType }] = useTheme();
    return (
        <SyntaxHighlighter
            language={props.lang}
            useInlineStyles={false}
            //style={dark}
            //style={themeType === "light" ? light : dark}
            //showLineNumbers={props.showLineNumbers}
            //showInlineLineNumbers={props.showLineNumbers}
            wrapLongLines={props.wrapLongLines === undefined ? true : props.wrapLongLines}
            lineNumberStyle={{
                paddingRight: "16px",
            }}
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