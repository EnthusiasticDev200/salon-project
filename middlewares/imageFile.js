
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

module.exports = upload.single('File'); // <-- must match Postman key
