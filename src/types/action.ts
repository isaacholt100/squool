export default interface IAction {
    type: string;
    payload: any;
    notify?: boolean;
}