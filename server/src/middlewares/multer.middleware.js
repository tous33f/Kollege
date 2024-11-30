import multer from "multer";
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        const ext=file.originalname.split(".").pop()
        const name=uuidv4()
        cb(null, name+"."+ext )
    }
  })

const upload = multer({ storage: storage })

export {upload}