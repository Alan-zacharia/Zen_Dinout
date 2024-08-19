import { Request } from "express";
import formidable from "formidable";


const formidableHandle = async (req : Request)=>{
    const form = formidable({});
    let fields;
    let files;
    [fields, files] = await form.parse(req);
    const datas: any = { ...fields };
    return datas;
}

export default formidableHandle;