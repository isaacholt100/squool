export default interface IChat {
    _id: string;
    admin_id: string;
    name: string;
    member_ids: string[];
}

export interface IChatMessage {
    _id: string;
    chat_id: string;
    owner_id: string;
    content: string;
    files: IChatFile[];
}

export interface IChatFile {
    name: string;
    url: string;
    size: number;
    type: string;
}