const path = require('path')
const fs = require('fs')
function Module(id){
    this.id = id
    this.exports = {}
}

Module._extenstions ={
    '.js'(){},
    '.json'(){}
}


Module._resolveFilename = function(id){

    let newpath = path.resolve(__dirname,id)


    let ext = Object.keys(Module._extenstions)

    for(let i =0;i<ext.length;i++){
        let newPath = `${newpath}${ext[i]}`
       
        if(fs.existsSync(newPath)) return newPath
    }

}




function myRequire(id){
    let path = Module._resolveFilename(id)
    console.log(path);
}



let a = myRequire('./a')