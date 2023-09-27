import React, { useState, useCallback } from 'react';

import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-hot-toast';

const UploadedItemsComponent = ({ onSuccess, bucket, folder }) => {
  const configForMultiForm = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  const [isLoading, setIsLoading] = useState(false);

  function Dropzone() {
    const onDrop = useCallback(async (acceptedFiles) => {
      const file = acceptedFiles[0];

      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);
      formData.append('folder', folder);
      setIsLoading(true);
      try {
        const { data } = await axios.post(`http://localhost:4002/upload`, formData, configForMultiForm);
        onSuccess();
        toast.success('File uploaded successfully');
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.error_message);
      }
      setIsLoading(false);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
    });

    return (
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div>
          <LoadingButton color='primary' variant='contained' loading={isLoading}>
            Upload
          </LoadingButton>
        </div>
      </div>
    );
  }

  if (!bucket || !folder)
    return (
      <div style={{ padding: '1em', justifyContent: 'center' }} className='row'>
        <div>
          <h3>Set bucket and folder in App.js</h3>
        </div>
      </div>
    );

  return (
    <div style={{ padding: '1em', justifyContent: 'center' }} className='row'>
      <Dropzone />
    </div>
  );
};

export default UploadedItemsComponent;
