const { spawnSync } = require('child_process');
const fs = require('fs');

const trainFace = (filename, id) =>{
    //take the file and generate model accordingly, save it with the name of id and store in ml/model folder
    const pythonGeneration = runPythonSync([ 'ml/preprocessing.py', filename, id ]);
    console.log(pythonGeneration.stderr)
    fs.rm(path.join(__dirname, "registration", filename), (err)=>{})
    if(parseInt(pythonGeneration.status) === 0){
        //continue only if python properly exists after procesing
        return {code: 200, text: "Completed the processing"};
    }
    return {code: 400, text: "Error processing the video"}
}

// const trainFace = (filename, id) =>{
//     //take the file and generate model accordingly, save it with the name of id and store in ml/model folder
//     const pythonGeneration = runPythonSync([ 'ml/cnn/training.py', filename, id ]);
//     console.log(pythonGeneration.stderr)
//     if(parseInt(pythonGeneration.status) === 0){
//         //continue only if python properly exists after procesing
//         return {code: 200, text: "Completed the processing"};
//     }
//     return {code: 400, text: "Error processing the video"}
// }

const verifyFace = (filename, id) =>{
    //Run face recognition.
    const result_encoded = runPythonSync(['ml/face_recognition.py', filename, id])
    console.log(result_encoded.stdout, result_encoded.stderr)
    //proceed if only python reutrns proper exit code, which is 0, else code encountered an erorr, so terminate the face recognition
    if(parseInt(result_encoded.status) === 0)
        //True will be printed by  python in case of match to the stdout, else false is printed, which we send to the api
        return result_encoded.stdout.includes('True')
    return false;
}

// const verifyFace = (filename, id) =>{
//     //Run face recognition.
//     const result_encoded = runPythonSync(['ml/cnn/verify.py', filename, id])
//     console.log(result_encoded.stdout, result_encoded.stderr)
//     //proceed if only python reutrns proper exit code, which is 0, else code encountered an erorr, so terminate the face recognition
//     if(parseInt(result_encoded.status) === 0)
//         //True will be printed by  python in case of match to the stdout, else false is printed, which we send to the api
//         return result_encoded.stdout.includes('True')
//     return false;
// }

const runPythonSync = (arr) =>{
    //run a python code in sync with the curent process, arr will be an array of commands to be processed in python
    return spawnSync('python', arr, { encoding: 'utf-8' }) //enccoding is to read the python stdout by nodejs
}

module.exports = { trainFace, verifyFace }