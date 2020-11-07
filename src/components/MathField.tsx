import { makeStyles, Theme, withStyles } from "@material-ui/core";
import dynamic from "next/dynamic";
import { MQ, Config } from "@edtr-io/mathquill";

const EditableMathField: any = dynamic(
    () => import("react-mathquill").then(mod => mod.EditableMathField) as any,
    {
        ssr: false
    }
);

const styles = (theme: Theme) => {
    const borderColor = theme.palette.type === "light" ? "rgba(0, 0, 0, 0.23)" : "rgba(255, 255, 255, 0.23)";
    return {
        "@global": {
            ".mq-focused": {
                boxShadow: "none !important",
                borderColor: theme.palette.primary.main + " !important",
            },
            ".mq-math-mode": {
                borderRadius: "8px !important",
                padding: "8.5px 14px !important",
                "&:hover": {
                    borderColor: theme.palette.text.primary + " !important",
                },
                "@media (hover: none)": {
                    "&:hover": {
                        borderColor,
                    },
                },
                borderWidth: 2,
                outline: "none !important",
                fontSize: "18px !important"
            },
            ".mq-cursor": {
                borderColor: theme.palette.text.primary + " !important",
            }
        }
    }
};

interface FieldProps {
    latex?: string;
    config?: Config;
    onChange?(mathField: MQ): void;
    mathquillDidMount?(mathField: MQ): void;
}

function MathField(props: FieldProps) {
    return (
        <EditableMathField
            latex={props.latex}
            onChange={props.onChange}
            mathquillDidMount={props.mathquillDidMount}
            config={props.config}
        />
    );
}
export default withStyles(styles)(MathField);