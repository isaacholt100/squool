export default interface IBook {
    _id: string;
    name: string;
    class_id: string;
    owner_id: string;
    comments: IComment[];
    lastEdited: Date;
    period: string;
}
export interface IComment {
    _id: string;
}