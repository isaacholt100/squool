import { canViewFile } from "../lib/file";
import { equal } from "../lib/array";
import { getDB } from "../lib/idb";
import IFile from "../types/IFile";

interface IData {
    db_id: string;
    files: IFile[];
    user_id: string;
}

self.addEventListener("message", async ({ data }: { data: IData }) => {
    try {
        const db = await getDB(data.db_id);
        //const tx = db.transaction("files", "readwrite");
        const all = await db.getAll("files");
        const l = all.length;
        console.log(l);
        for (let i = 0; i < l; i++) {
            const oldFile: IFile = all[i];
            const currentFile = data.files.find(f => f._id === all[i]._id);
            console.log(currentFile, canViewFile(currentFile, data.user_id));
            
            if (currentFile && canViewFile(currentFile, data.user_id)) {
                let update = false;
                if (currentFile.name !== oldFile.name || currentFile.extension !== currentFile.extension || !equal(currentFile.tags.sort(), oldFile.tags.sort()) || !equal(currentFile.viewer_ids.sort(), currentFile.viewer_ids.sort()) || !equal(currentFile.writer_ids.sort(), currentFile.writer_ids.sort())) {
                    update = true;
                    currentFile.blob = oldFile.blob;
                }
                if (currentFile.modified !== oldFile.modified) {
                    const res = await fetch(data.files[i].url);
                    const blob = await res.blob();
                    currentFile.blob = blob;
                    update = true;
                }
                if (update) {
                    await db.put("files", currentFile, currentFile._id);
                }
            } else {
                await db.delete("files", oldFile._id);
            }
        }
        /*await Promise.all([
            ...updates,
            tx.done,
        ]);*/
        self.postMessage(true);
    } catch (err) {
        console.error(err);
        self.postMessage(false);
    }
    //self.postMessage(true);
});