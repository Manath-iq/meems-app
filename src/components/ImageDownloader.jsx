import React from "react";
import html2canvas from "html2canvas";

const ImageDownloader = ({ containerRef, fileName = "meme.png", onError }) => {
  const handleDownload = async () => {
    if (!containerRef?.current) {
      if (onError) onError("Контейнер с мемом не найден.");
      return;
    }

    try {
      // Генерация изображения из контейнера с мемом
      const canvas = await html2canvas(containerRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
      });

      canvas.toBlob((blob) => {
        if (!blob) {
          if (onError) onError("Ошибка при создании изображения.");
          return;
        }

        if (window.Telegram?.WebApp) {
          // Используем Telegram SDK
          const file = new File([blob], fileName, { type: "image/png" });
          const url = URL.createObjectURL(file);

          Telegram.WebApp.downloadFile({
            url,
            file_name: fileName,
          });

          URL.revokeObjectURL(url);
        } else {
          // Альтернативное скачивание через браузер
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, "image/png");
    } catch (error) {
      if (onError) onError(`Ошибка при скачивании мема: ${error.message}`);
    }
  };

  return (
    <button onClick={handleDownload} className="image-downloader-button">
      Скачать мем
    </button>
  );
};

export default ImageDownloader;