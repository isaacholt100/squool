import { openDB } from "idb";
import IFile from "../types/IFile";

interface IClassDB {
    files: IFile[];
}

export async function getClassDB(_id: string) {
    const db = await openDB<IClassDB>(_id, undefined, {
        upgrade(db) {
            console.log("upgrade");
            
            db.createObjectStore("files");
            //store.createIndex("_id", "_id");
        },
        terminated() {
            throw new Error("DB terminated");
        }
    });
    return db;
}
export async function getDB(db_id: string) {
    if (db_id.slice(0, 6) === "class_") {
        return getClassDB(db_id);
    }
    // For now
    return getClassDB(db_id);
}