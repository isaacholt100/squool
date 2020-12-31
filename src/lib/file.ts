import IFile from "../types/IFile";

export function canViewFile(file: IFile, user_id: string) {
    return canWriteFile(file, user_id) || file.viewer_ids.includes(user_id);
}
export function canWriteFile(file: IFile, user_id: string) {
    return file.owner_id === user_id || file.writer_ids.includes(user_id);
}