import multer from "multer";
import fs from "fs";


export const upload = () => {
 let folder ='uploads/'


  if(!fs.existsSync(folder)){
    fs.mkdirSync(folder,{recursive:true})
  }

  const storage = multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,folder)
    },
    filename:function(req,file,cb){
      const fileName = file.fieldname + '-'  + Date.now()  + '-' + file.originalname
      cb(null,fileName)
    }
  })
  return multer({ storage});
};