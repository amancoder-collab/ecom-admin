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
      if (!multiple && value) return; // Prevent upload if single image and already has a value

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
        // Handle error (e.g., show an error message to the user)
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
    console.log(images, 'images');
    return images.map(
      (url, index) =>
        url && (
          <Box key={url} sx={{ position: 'relative' }}>
            <Image
              width={100}
              height={100}
              src={url}
              alt={`Uploaded ${index}`}
              className="object-cover"
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
