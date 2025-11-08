
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

console.log("upload from Midware", upload)

module.exports = upload.single('file'); // <-- must match Postman key
