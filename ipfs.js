const express = require('express');
const { appendFile } = require('fs');
var ipfsClient = require('./ipfs_client');
var bodyParser = require('body-parser')
 fs = require('fs')
const api = express();
const HOST = '0.0.0.0'
const PORT = 4007
api.use(bodyParser.json())
// var fileName=req.body.fileName
// var fileContent =req.body.fileContent

api.post('/store', async (req, res) => { //storing the data
    console.log('work')
    
    let fileName = req.body.fileName
    let fileContents = req.body.fileContents
    // console.log(req.body)
    console.log(fileName)
    let bufferObj = Buffer.from(fileContents, "base64")
    
    //let decodedString = bufferObj.toString("utf8")
    // console.log("The decoded string:", decodedString)
    fs.writeFileSync(fileName, fileContents, function (err) {
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
        res.send({"hash":posHash})
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
 
    ipfsClient.fetchFile(ipfshash, function (content) {
        fs.writeFileSync("fileName.docx" ,content.base64, function (err) {
            if (err) return console.log(err);
            console.log('file is saved');
        });
        //if(!err) {
        // console.log('ipfs chain code file ' + content.base64);
        res.send(content);
        //} else
        //    console.log("Error fetching file from IPFS " + err);
    });    
    // res.status(200).send('retrive data')
})
api.listen(PORT, () => console.log("server is starting and listening on port 4007"))
