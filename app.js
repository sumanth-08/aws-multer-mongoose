const express = require('express')
const router = express.Router()               
const multer = require('multer')              
const Aws = require('aws-sdk')                
const Product = require('./models/product.js')  
require("dotenv").config()       

const storage = multer.memoryStorage({
    destination: function (req, file, cb) {
        cb(null, '')
    }
})

const filefilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({ storage: storage, fileFilter: filefilter });

const s3 = new Aws.S3({
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,              
    secretAccessKey:process.env.AWS_ACCESS_KEY_SECRET      
})

router.post('/', upload.single('productImage'), (req, res) => {
    console.log(req.file)
    

    const params = {
        Bucket:process.env.AWS_BUCKET_NAME,      
        Key:req.file.originalname,          
        Body:req.file.buffer,                   
        // ACL:"public-read-write",             
        ContentType:"image/jpeg"           
    };

    s3.upload(params,(error,data)=>{
        if(error){
            res.status(500).send({"err":error})  
        }

    console.log(data) 
    
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        productImage: data.Location
    });
    product.save()
        .then(result => {
            res.status(200).send({
                _id: result._id,
                name: result.name,
                price: result.price,
                productImage: data.Location,
            })
        })
        .catch(err => {
            res.send({ message: err.message })
      })
})
})

router.get('/list', (req, res) => {
    try {
        console.log("hello")
        const products =  Product.find()
        
        console.log(products)
        res.send(products)
    } catch (err) {
        res.send({ message: err, m:"not working" })
    }
});

module.exports = router