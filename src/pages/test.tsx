import { NextPageContext } from "next";
import File from "../components/file/File";

export default function Test(props) {
    console.log(props);
    
    return (
        <File url={"https://file-examples-com.github.io/uploads/2017/02/file-sample_1MB.docx"} ext={"docx"} />
    )
}