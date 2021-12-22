const express = require('express');
const { appendFile } = require('fs');
var ipfsClient = require('./ipfs_client');
var bodyParser = require('body-parser')
const crypto = require("crypto")
 fs = require('fs')
const api = express();
const HOST = '0.0.0.0'
const PORT = 4009
api.use(bodyParser.json())
const algorithm ="aes-256-cbc"
const initVector =crypto.randomBytes(16)
const Securitykey = crypto.randomBytes(32)
var encryptedData
// let bufferObj1 = Buffer.from(Securitykey, "base64")
// console.log(bufferObj1)
// let decodedString = bufferObj1.toString("utf8")
// console.log(decodedString)
// var fileName=req.body.fileName
// var fileContent =req.body.fileContent

api.post('/store', async (req, res) => { //storing the data
    console.log('work')
    
    let fileName = req.body.fileName
    let fileContents = req.body.fileContents
    // console.log(req.body)
    console.log(fileName)
    const message = fileContents
    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector)
     encryptedData = cipher.update(message, "utf-8", "hex")
    encryptedData += cipher.final("hex")
   // console.log("Encrypted message: " + encryptedData)
    let bufferObj = Buffer.from(fileContents, "base64")
    
    //let decodedString = bufferObj.toString("utf8")
    // console.log("The decoded string:", decodedString)
    fs.writeFileSync(fileName,encryptedData, function (err) {
        if (err) return console.log(err);
        console.log(fileName)
        console.log('file is saved');
    });
    var posHash
    await ipfsClient.storeFile_by_VIKAS(fileName).then((posH) => {
        console.log(posH);
        posHash = posH;
        // data["posHash"] = posHash;
        
        console.log('inside ipfs file storage function status ', posHash);
        res.send({"hash":posHash ,encryptedData})
    }).catch((err) => {
        console.log(err);
        //data["posHash"] = null;err
        shouldReturnFromFunction = true
        res.send('\'Failed to store record in ipfs\'')

    })

    // res.status(200).send('store data')
})



api.get('/retrive', (req, res) => {  // fetching the data
    let ipfshash = req.body.ipfshash
    
   const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
//     console.log(encryptedData)
 let decryptedData = decipher.update(encryptedData, "hex", "utf-8");

 decryptedData += decipher.final("utf8");

 
    ipfsClient.fetchFile(ipfshash, function (content) {
        fs.writeFileSync("fileName.docx" ,content.base64, function (err) {
            if (err) return console.log(err);
            console.log('file is saved');
        });
       
       // res.send({"decryptedData":decryptedData});
       res.send(content)
        //} else
      // console.log(decryptedData)
        //    console.log("Error fetching file from IPFS " + err);
    });    
    // res.status(200).send('retrive data')
})
api.listen(PORT, () => console.log("server is starting and listening on port", PORT))

exports.Securitykey =Securitykey
exports.algorithm=algorithm
exports.initVector=initVector