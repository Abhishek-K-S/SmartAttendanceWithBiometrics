const { spawnSync } = require('child_process');

// const events = require('events')

//remove all corresponding files

const trainFace = (filename, id) =>{
    const pythonGeneration = runPythonSync([ 'ml/data_generation.py', filename, id ]);
    if(parseInt(pythonGeneration.status) === 0){
        if(parseInt(runPythonSync([ 'ml/training.py', id]).status) === 0){
            return {code: 200, text: "Completed the processing"};
        }
    }
    return {code: 400, text: "Error processing the video"}
}

const verifyFace = (filename, id) =>{
    const result_encoded = runPythonSync(['ml/face_recognition.py', filename, id])
    
    return result_encoded.stdout.includes('True')
}

const runPythonSync = (arr) =>{
    return spawnSync('python', arr, { encoding: 'utf-8' })
}

module.exports = { trainFace, verifyFace }