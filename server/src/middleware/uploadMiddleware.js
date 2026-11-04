
const multer = require("multer");

const upload = multer({
    storage:multer.memoryStorage(),

    limits:{
        fileSize:1*1024*1024,
    },

    fileFilter:(req,file,cb)=>{
        if(["image/jpeg","image/png"].includes(file.mimetype)){
            return cb (null,true);
        }
        cb(new Error("Only JPG or PNG Images are allowes"));
    },  

}).fields([
    { name: "nicFrontImage", maxCount: 1 },
  { name: "nicBackImage", maxCount: 1 },
  { name: "profilePhoto", maxCount: 1 },
]);

const uploadRegistrationFiles=(req,res,next)=>{
    upload(req,res,(err)=>{
        if(!err) return next();
        const message=
        err.code ==="LIMIT_FILE_SIZE"?"Each Image must be 1MB or Samller":err.message;
        return res.status(400).json({
            success:false,message
          });
    });
};

module.exports ={uploadRegistrationFiles};