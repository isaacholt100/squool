export type ContextMenuItem = {
    label: string;
    icon?: JSX.Element;
    fn(): void;
} | "divider";