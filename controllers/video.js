exports.getVidoes = (req, res, next) => {
  res.status(200).json({
    videos: [
      {
        _id: '1',
        title: 'First Post',
        content: 'This is the first post!',
        imageUrl: 'images/duck.jpg',
        creator: {
          name: 'vidium'
        },
        createdAt: new Date()
      }
    ]
  });
};

exports.createVideo = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  // Create post in db
  res.status(201).json({
    message: 'Video uploaded successfully!',
    video: { id: new Date().toISOString(), title: title, content: content }
  });
};
