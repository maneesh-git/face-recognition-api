const Clarifai = require('clarifai');

// Using the clarifai API
// Add your Clarifai API here
// This is a fake API key and will not work anymore
const app = new Clarifai.App({ apiKey: '5d2af8f32f9b4aacae06b9a9e0c45678' });


const handleImageApiCall = (req,res) => {
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error in API call"));
}

const handleImagePut = (req,res,db) => {
    const { id } = req.body;
    db('users').where('id','=',id)
        .increment('entries',1)
        .returning('entries')
        .then(entries => res.json(entries[0]))
        .catch(err => res.status(400).json("Unable to get entries"));
}

module.exports = {
    handleImagePut,
    handleImageApiCall
}