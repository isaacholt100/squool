import { NextPageContext } from "next";
import File from "../components/file/File";

export default function Test(props) {
    console.log(props);
    
    return (
        <File url={"https://file-examples-com.github.io/uploads/2017/02/file-sample_1MB.docx"} ext={"docx"} />
    )
}
export async function getServerSideProps(ctx: NextPageContext) {
    const res = await fetch("http://dummy.restapiexample.com/api/v1/employees");

    return {
        props: {
            json: await res.json(),
        }
    }
}