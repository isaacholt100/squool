import Profile from "../../components/Profile";

export default function ProfilePage() {
    return (
        <Profile user={{
            email: "email@domain.tld",
            firstName: "Mrs",
            lastName: "Someone",
            _id: "whgodf90gdjfdjfg",
            role: "admin",
            icon: "",
        }} />
    );
}