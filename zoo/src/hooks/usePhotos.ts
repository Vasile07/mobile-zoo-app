import { useEffect, useState } from 'react';
import { useCamera } from './useCamera';

export interface MyPhoto {
  filepath: string;
  webviewPath?: string;
}

const PHOTOS = 'photos';

export function usePhotos() {
  const { getPhoto } = useCamera();

  return {
    takePhoto,
  };

  async function takePhoto() {
    const data = await getPhoto();
    // const filepath = new Date().getTime() + '.jpeg';
    // const webviewPath = `data:image/jpeg;base64,${data.base64String}`
    // const newPhoto = { filepath, webviewPath };
    // const newPhotos = [newPhoto, ...photos];
    // setPhotos(newPhotos);

    return data;
  }
}
