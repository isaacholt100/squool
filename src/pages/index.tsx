import { Button, Card, Typography } from "@material-ui/core"
import Link from "next/link";
import Title from "../components/Title";

export default function LandingPage() {
    return (
        <div>
            <Title title="Squool" />
            <Card>
                <Typography variant="h3" gutterBottom>Landing Page</Typography>
                <Link href="/home">
                    <Button variant="outlined" color="primary" component="a">
                        Open Squool
                    </Button>
                </Link>
                <Link href="/signup">
                    <Button color="primary" component="a">
                        Sign up
                    </Button>
                </Link>
            </Card>
        </div>
    );
}