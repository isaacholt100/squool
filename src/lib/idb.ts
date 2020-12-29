import { openDB } from "idb";
import IFile from "../types/IFile";

interface IClassDB {
    files: IFile[];
}

export async function getClassDB(_id: string) {
    const db = await openDB<IClassDB>(_id, undefined, {
        upgrade(db) {
            console.log("upgrade");
            
            const store = db.createObjectStore("files", {
                keyPath: "_id",
                autoIncrement: false,
            });
            //store.createIndex("_id", "_id");
        },
        terminated() {
            throw new Error("DB terminated");
        }
    });
    return db;
}