import { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import UploadItemComponent from './components/UploadItemComponent';
import UploadedItemsGrid from './components/UploadedItemsGrid';
import { InternalToaster } from './components/InternalToaster';
import toast from 'react-hot-toast';

const bucket = process.env.REACT_APP_S3_BUCKET_NAME;
const folder = '000-test-upload-folder-1';

const App = () => {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllLinks = async () => {
    try {
      const { data } = await axios.get(`http://localhost:4002/get-links?bucket=${bucket}&folder=${folder}`);
      setLinks(data.links);
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error_message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAllLinks();
  }, []);

  return (
    <div>
      <InternalToaster />
      {isLoading ? <CircularProgress /> : <UploadedItemsGrid links={links} bucket={bucket} folder={folder} onDeleteSuccess={getAllLinks} />}
      <UploadItemComponent onSuccess={getAllLinks} bucket={bucket} folder={folder} />
    </div>
  );
};

export default App;
