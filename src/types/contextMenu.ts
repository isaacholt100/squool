import { ButtonProps } from "@material-ui/core";

export type ContextMenuItem = ({
    label: string;
    icon?: JSX.Element;
    fn(): void;
} & ButtonProps) | "divider";