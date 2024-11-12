/* eslint-disable prettier/prettier */
export const CLOUDINARY = 'Cloudinary';

export const CLOUDINARY_CONFIG = {
  folder: 'user-avatars',
  allowedFormats: ['jpg', 'png', 'jpeg'],
  transformation: [{ width: 500, height: 500, crop: 'fill' }],
};
