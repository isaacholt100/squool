import Link from "next/link";
import { Link as ButtonLink, Typography } from "@material-ui/core";
import { Variant } from "@material-ui/core/styles/createTypography";

export default function BtnLink({ variant, href, label, ...other }: { variant?: Variant, href: string, label: string } & any) {
    return (
        <Link href={href}>
            <ButtonLink component="button" {...other}>
                <Typography variant={variant}>{label}</Typography>
            </ButtonLink>
        </Link>
    );
}