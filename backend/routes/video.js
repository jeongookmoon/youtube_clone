const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Video } = require('../model/video');

// https://stackoverflow.com/questions/45555960/nodejs-fluent-ffmpeg-cannot-find-ffmpeg
// const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
// ffmpeg.setFfmpegPath(ffmpegPath);

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, 'files/');
  },
  filename: (request, file, callback) => {
    callback(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (request, file, callback) => {
    const extension = path.extname(file.originalname)

    if (extension !== '.mp4')
      return callback(response.status(400).end('only mp4 is allowed'), false);

    callback(null, true);
  }

})

const upload = multer({ storage: storage }).single("file")

router.post('/upload', (request, response) => {
  // save video file on server
  upload(request, response, error => {
    if (error) {
      return response.json({ success: false, error });
    }

    return response.json({ success: true, filePath: response.req.file.path, fileName: response.req.file.filename });
  })
});

router.post('/uploadInfo', (request, response) => {
  // save video info
  const video = new Video(request.body);

  video.save((error, document) => {
    if (error) return response.json({ success: false, error })
    response.status(200).json({ success: true })
  })

})

router.post('/thumbnail', (request, response) => {

  let thumbnailPath = "";
  let clipDuration = "";

  ffmpeg.ffprobe(request.body.filePath, (error, metadata) => {
    clipDuration = metadata.format.duration;
  })

  ffmpeg(request.body.filePath)
    .on('filenames', (filenames) => {
      thumbnailPath = "upload/thumbnail/" + filenames[0];
    })
    .on('end', () => {
      return response.json({ success: true, thumbnailPath, clipDuration })
    })
    .screenshots({
      // Will take screens at 20%, 40%, 60% and 80% of the video
      count: 1,
      folder: 'upload/thumbnail',
      size: '320x240',
      // %b input base name without extension
      filename: 'thumbnail-%b.png'
    });
});

module.exports = router;