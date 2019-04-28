//required dependencies
const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

//Storage Location
const storage = multer.diskStorage({
    destination: './files/photos/',
    __filename: function(req, file, cb){
        cb(null, file.fieldname + '~' + Date.now() + path.extname(file.originalname));
    }
});

//Upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('myPhoto');

//Function To Valide File Type
function checkFileType(file, cb){

    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname & mimetype){
        return cb(null, true);
    } else{
        cb ("Pictures Only!");
    }
    

}

//Init app
const app = express();

//EJS
app.set('view engine', 'ejs');

//Folder
app.use(express.static('./files'));


app.get('/', (req, res)=> res.render('index'));
app.post('/upload', (req, res) => {
upload(req, res, (err)=> {
if(err){
    res.render('index',{
        msg: err
    })

}
else{
    if(req.file==undefined){
        res.render('index',{
            msg: "File Not Selected"
        });
    } else{
        res.render('index', {
           msg: "Upload Successfully!",
           file: `photos/${req.file.filename}`  
        });
    }
}
});
});

const port = 3000;
app.listen(port, () => console.log('Server Started On Port Number 3000'));


