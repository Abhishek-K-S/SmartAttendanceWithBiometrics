const { spawnSync, spawn } = require('child_process')
const fs = require('fs')

const trainFace = (filename, id) =>{
    let py = runPythonAsync(['ml/cnn/preprocessing.py', filename, id])
    py.stdout.on('data', function(data) {
        console.log(data.toString());
    });
    py.on('close', function(code) {
        console.log('function finished')
        fs.rm(path.join(__dirname, "registration", filename), (err)=>{})
    });
    return {code: 200, text: "processing your request"}
}

const verifyFace = (filename, id) =>{
    const result_encoded = runPythonSync(['ml/cnn/face_recognition.py', filename, id])
    console.log(result_encoded.stdout, result_encoded.stderr)
    //proceed if only python reutrns proper exit code, which is 0, else code encountered an erorr, so terminate the face recognition
    if(parseInt(result_encoded.status) === 0)
        //True will be printed by  python in case of match to the stdout, else false is printed, which we send to the api
        return result_encoded.stdout.includes('True')
    return false;
}

const runPythonSync = (arr) =>{
    //run a python code in sync with the curent process, arr will be an array of commands to be processed in python
    return spawnSync('python', arr, { encoding: 'utf-8' }) //enccoding is to read the python stdout by nodejs
}

const runPythonAsync = (arr) =>{
    //run a python code in sync with the curent process, arr will be an array of commands to be processed in python
    return spawn('python', arr, { encoding: 'utf-8' }) //enccoding is to read the python stdout by nodejs
}

module.exports = {trainFace, verifyFace}