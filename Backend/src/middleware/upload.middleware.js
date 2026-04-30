import multer from "multer";
import path from 'path';
import fs from 'fs';

const uploadPath = "uploads";
if(!fs.existsSync(uploadPath)){
    fs.mkdirSync(uploadPath)
}

// stroage config
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, uploadPath)
    },
    filename:function(req,file,cb){
        const uniqueName= Date.now()+ "-" + file.originalname.replace(/\s+/g, "-");
        cb(null, uniqueName)
    }
})

// File Filter (only pdf)
const fileFilter = (req,file,cb)=>{
    if(file.mimetype === "application/pdf"){
        cb(null, true)
    }else{
        cb(new Error("Only pdf files are allowed"), false)
    }
}
// Multer instance

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
});
export default upload;