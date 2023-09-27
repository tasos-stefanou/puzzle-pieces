import AWS from 'aws-sdk';
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

const upload = multer({ dest: 'uploads/' }); // Change 'uploads/' to your desired destination path

app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Hello from S3 uploader' });
});

app.post('/upload', upload.single('file'), async (req, res) => {
  console.log(req.body);
  const file = req.file;
  const fileName = file.originalname;
  const filePath = file.path;
  const { bucket, folder } = req.body;

  try {
    await s3.headBucket({ Bucket: bucket }).promise();
    const fileData = fs.readFileSync(filePath);

    const params = {
      Bucket: bucket,
      Key: `${folder}/${fileName}`,
      Body: fileData,
      // Make file accessible to public and via browser
      ACL: 'public-read',
      ContentType: file.mimetype, // Set the content type of the file
    };

    const data = await s3.upload(params).promise();

    console.log('File uploaded successfully:', data.Location);
    return res.status(200).json({ message: 'File uploaded successfully', location: data.Location });
  } catch (err) {
    console.log(err);
    if (err.code === 'NotFound') {
      return res.status(500).json({ error_message: 'Bucket does not exist' });
    } else {
      return res.status(500).json({ error_message: 'Failed to upload file to S3' });
    }
  }
});

app.get('/get-links', async (req, res) => {
  const { bucket, folder } = req.query;

  if (!bucket || !folder) {
    return res.status(500).json({ error_message: 'Bucket and folder are required' });
  }

  try {
    await s3.headBucket({ Bucket: bucket }).promise();

    const params = {
      Bucket: bucket,
      Prefix: `${folder}/`,
    };

    const data = await s3.listObjectsV2(params).promise();

    const sortedFiles = data.Contents.sort((a, b) => b.LastModified - a.LastModified);

    const links = sortedFiles.map((file) => {
      const url = s3.getSignedUrl('getObject', {
        Bucket: bucket,
        Key: file.Key,
        Expires: 360000, // Optional: Set the expiration time for the URL
      });
      return url;
    });

    return res.status(200).json({ links });
  } catch (err) {
    console.log(err);
    if (err.code === 'NotFound') {
      return res.status(500).json({ error_message: 'Bucket does not exist' });
    } else {
      return res.status(500).json({ error_message: 'Failed to retrieve file links from S3' });
    }
  }
});

const port = process.env.PORT || 4002;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
