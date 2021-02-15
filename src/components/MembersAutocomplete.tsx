import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { getFullName } from "../lib/userName";
import IUser from "../types/IUser";

interface IProps<T extends boolean> {
    value: T extends true ? string[] : string;
    setValue(value: T extends true ? string[] : string): void;
    users: IUser[];
    multiple: T;
}

export default function MembersAutocomplete<T extends boolean>(props: IProps<T>) {
    console.log(props.value);
    
    return (
        <Autocomplete
            multiple={props.multiple}
            value={props.value as any}
            onChange={(_e, newValue) => {
                props.setValue(!newValue ? null : newValue._id as any)
            }}
            id="user-autocomplete"
            options={props.users}
            fullWidth
            getOptionLabel={(option: string) => {
                const user = props.users.find(u => u._id === option);
                return !user ? "" : getFullName(user);
            }}
            getOptionSelected={(option, value) => !value ? false : Array.isArray(value) ? value.includes(option._id) : value === option._id}
            renderInput={(params) => (
                <TextField {...params} label="Search users" />
            )}
            renderOption={(option: IUser) => (
                <>
                    {getFullName(option)}
                </>
            )}
            filterOptions={(options, state) => {
                return options.filter(option => getFullName(option).toLocaleLowerCase().includes(state.inputValue.toLocaleLowerCase()))
            }}
        />
    );
}