import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

export function useFiles() {
    const downloadImage = async (base64Image: string) => {
        try {
            // Remove the prefix
            const base64Data = base64Image.split(',')[1];
            
            // Use Capacitor Filesystem to save the image
            const fileName = 'image.jpg';
    
            await Filesystem.writeFile({
                path: fileName,
                data: base64Data,
                directory: Directory.Data
            });
    
            console.log('Image saved successfully:', fileName);
        } catch (error) {
            console.error('Error saving image:', error);
        }
    };
    
    return {
        downloadImage,
    }
    
}
