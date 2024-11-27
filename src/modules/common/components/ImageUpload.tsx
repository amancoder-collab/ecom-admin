import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from '@/api';
import Image from 'next/image';

interface ImageUploadProps {
  value: string | string[];
  onChange: (urls: string | string[]) => void;
  multiple?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  multiple = false,
}) => {
  const [uploading, setUploading] = React.useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!multiple && value) return;

      setUploading(true);
      try {
        const uploadedUrls = await Promise.all(
          acceptedFiles.map(async (file) => {
            const formData = new FormData();
            formData.append('image', file);

            const response = await api.upload.uploadImage(formData);
            console.log(response);

            return response?.data?.data?.secure_url;
          }),
        );

        if (multiple) {
          onChange([...(Array.isArray(value) ? value : []), ...uploadedUrls]);
        } else {
          onChange(uploadedUrls[0]);
        }
      } catch (error) {
        console.error('Error uploading images:', error);
      } finally {
        setUploading(false);
      }
    },
    [value, onChange, multiple],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple,
    noClick: !multiple && value ? true : false, // Disable click when single image is uploaded
    noKeyboard: !multiple && value ? true : false, // Disable keyboard interaction when single image is uploaded
  });

  const removeImage = (indexToRemove: number) => {
    if (multiple && Array.isArray(value)) {
      const newUrls = value.filter((_, index) => index !== indexToRemove);
      onChange(newUrls);
    } else {
      onChange('');
    }
  };

  const renderImages = () => {
    const images = Array.isArray(value) ? value : [value];
    return images.map(
      (url, index) =>
        url && (
          <Box key={url} sx={{ position: 'relative' }}>
            <img
              src={url}
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
              }}
              alt=""
            />
            <IconButton
              size="small"
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                bgcolor: 'background.paper',
              }}
              onClick={() => removeImage(index)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ),
    );
  };

  return (
    <Box>
      {(!value || (multiple && Array.isArray(value))) && (
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed #cccccc',
            borderRadius: '4px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <Typography>
              Drop the image{multiple ? 's' : ''} here ...
            </Typography>
          ) : (
            <Typography>
              Drag &apos;n&apos; drop {multiple ? 'some images' : 'an image'}{' '}
              here, or click to select
            </Typography>
          )}
        </Box>
      )}
      {uploading && <CircularProgress />}
      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {renderImages()}
      </Box>
    </Box>
  );
};
