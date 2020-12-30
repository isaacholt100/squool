import { deleteDB } from "idb";
import { getDB } from "../lib/idb";
import IFile from "../types/IFile";

interface IData {
    db_id: string;
    files: IFile[];
}

self.addEventListener("message", async ({ data }: { data: IData }) => {
    try {
        //await deleteDB(data.db_id);
        const db = await getDB(data.db_id);
        const list: (IFile & { blob: Blob })[] = [];
        const l = data.files.length;
        for (let i = 0; i < l; i++) {
            const notExists = (await db.get("files", data.files[i]._id)) === undefined;
            if (notExists) {
                const res = await fetch(data.files[i].url);
                const blob = await res.blob();
                list.push({
                    ...data.files[i],
                    blob,
                });
            }
        }
        const tx = db.transaction("files", "readwrite");
        await Promise.all([...list.map(file => tx.store.add(file, file._id)), tx.done as any]);
        console.log(await db.getAll("files"));
        
        self.postMessage(true);
    } catch (err) {
        console.log(err);
        self.postMessage(false);
    }
});