import fetchData from "../lib/fetchData";
import { Handler } from "../types/fetch";
self.addEventListener("message", e => {
    console.log(e.data);
    
    fetchData(e.data, self.postMessage as Handler);
});
/*onmessage = e => {
    fetchData(e.data, postMessage as Handler);
}*/