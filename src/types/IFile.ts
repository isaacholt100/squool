export default interface IFile {
    _id: string;
    size: number;
    name: string;
    tags: string[];
    owner_id: string;
    writer_ids: string[];
    viewer_ids: string[];
    url: string;
    modified: Date;
    extension: string;
    blob?: Blob;
}
export type Tags = Record<string, string>;