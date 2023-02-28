const { spawnSync } = require('child_process');

// const events = require('events')

//remove all corresponding files

const trainFace = (filename) =>{
    const pythonGeneration = runPythonSync(['ml/data_generation.py', filename]);
    if(parseInt(pythonGeneration.status) === 0){
        if(parseInt(runPythonSync(['ml/training.py', filename ]).status) === 0){
            return {code: 200, text: "completed the processing"};
        }
    }
    return {code: 400, text: "error processing the video"}
}

const runPythonSync = (arr) =>{
    return spawnSync('python', arr)
}

module.exports = { trainFace }