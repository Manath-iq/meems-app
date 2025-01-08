import html2canvas from 'html2canvas';
import { useCallback } from 'react';

export function ImageDownloader({ containerRef, fileName = 'custom-image.png', onComplete, onError }) {
  const handleDownload = useCallback(async () => {
    if (!containerRef.current) {
      console.error('Container is not available');
      onError && onError('Container is not available');
      return;
    }

    try {
      const canvas = await html2canvas(containerRef.current);
      canvas.toBlob((blob) => {
        if (blob) {
          const fileUrl = URL.createObjectURL(blob);
          // Используем Telegram SDK для скачивания
          Telegram.WebApp.downloadFile({
            url: fileUrl,
            file_name: fileName,
          });
          onComplete && onComplete();
        } else {
          throw new Error('Failed to create blob from canvas');
        }
      });
    } catch (error) {
      console.error(error);
      onError && onError(error);
    }
  }, [containerRef, fileName, onComplete, onError]);

  return (
    <button className="download-button" onClick={handleDownload}>
      Скачать изображение
    </button>
  );
}