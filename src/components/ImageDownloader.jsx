import { Button } from '@telegram-apps/telegram-ui';
import html2canvas from 'html2canvas';

export function ImageDownloader({ containerRef, fileName, onComplete, onError }) {
  const handleDownload = async () => {
    try {
      if (!containerRef.current) return;

      const canvas = await html2canvas(containerRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: null
      });

      const dataUrl = canvas.toDataURL('image/png');
      
      // Для Telegram WebApp используем встроенный функционал
      if (window.Telegram?.WebApp) {
        // Конвертируем base64 в blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        
        // Создаем объект файла
        const file = new File([blob], fileName, { type: 'image/png' });
        
        // Отправляем файл через Telegram WebApp
        window.Telegram.WebApp.sendData(JSON.stringify({
          type: 'image',
          file: dataUrl
        }));
      } else {
        // Для обычного браузера - стандартное сохранение
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        link.click();
      }

      onComplete?.();
    } catch (error) {
      console.error('Ошибка при сохранении изображения:', error);
      onError?.(error);
    }
  };

  return (
    <Button 
      size="l" 
      className="action-button"
      onClick={handleDownload}
    >
      Сохранить
    </Button>
  );
}