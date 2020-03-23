const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: 'f3d0bcd0f07f4e029da85b475801e6ad'
 });

const handleApiCall = (req, res) => {
 app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err=> { res.status(400).json('API Error');
    })
}

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {  
      res.json(entries[0])
    })
    .catch(err=> {
      res.status(400).json('Unable to get count');
    })
}

module.exports={
    handleImage: handleImage,
    handleApiCall: handleApiCall
}