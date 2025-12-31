import multer from "multer";
import fs from "fs";

export const upload= ()=> {

    // alternative method
    // if(!fs.existsSync(folder)){
    // fs.mkdirSync('uploads/',{recursive:true})
    // }
    
    if (fs.existsSync('uploads')){

    const storage = multer.diskStorage({
        destination:function(req,file,cb)
        {
            cb(null,'uploads/')
        },
        filename:function(req,file,cb){
            const fileName = file.fieldname + '-' + Date.now() +'-'+ file.originalname
            cb(null,fileName)
        },
    })
    return multer({storage})
}else{
    fs.mkdirSync('uploads',{recursive:true})
       const storage = multer.diskStorage({
        destination:function(req,file,cb)
        {
            cb(null,'uploads/')
        },
        filename:function(req,file,cb){
            const fileName = file.fieldname + '-' + Date.now() +'-'+ file.originalname
            cb(null,fileName)
        },
    })
    return multer({storage})
}}