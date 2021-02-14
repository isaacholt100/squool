import { Button, ButtonProps, Tooltip } from "@material-ui/core";
import { useEffect, useRef, useState } from "react";
import copyToClipboard from "../lib/copyToClipboard";

export default function CopyButton({ text, label, ...other }: { text: string, label?: string } & ButtonProps) {
    const
        [copied, setCopied] = useState(false),
        timer = useRef<NodeJS.Timeout>(null),
        copyText = () => {
            clearTimeout(timer.current);
            setCopied(true);
            copyToClipboard(text);
        };
    useEffect(() => {
        if (copied) {
            timer.current = setTimeout(() => {
                setCopied(false);
            }, 1000);
        }
    }, [copied]);
    return (
        <Tooltip title="Copied!" open={copied}>
            <Button {...other} onClick={copyText}>
                {label || "Copy"}
            </Button>
        </Tooltip>
    );
}