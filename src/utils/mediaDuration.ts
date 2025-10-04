/**
 * 오디오/비디오 파일의 재생 시간을 추출하는 유틸리티
 */

/**
 * 파일의 duration을 HH:MM:SS 형식으로 반환
 * @param file - 오디오/비디오 파일
 * @returns Promise<string> - "HH:MM:SS" 형식의 duration 또는 "00:00:00"
 */
export const getMediaDuration = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    // 오디오/비디오 파일인지 확인
    const isAudio = file.type.startsWith('audio/');
    const isVideo = file.type.startsWith('video/');

    if (!isAudio && !isVideo) {
      resolve('00:00:00');
      return;
    }

    // 미디어 엘리먼트 생성
    const media = isAudio ? new Audio() : document.createElement('video');
    const objectUrl = URL.createObjectURL(file);

    media.preload = 'metadata';

    media.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);

      const duration = media.duration;
      if (isNaN(duration) || !isFinite(duration)) {
        resolve('00:00:00');
        return;
      }

      // duration을 HH:MM:SS로 변환
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      const seconds = Math.floor(duration % 60);

      const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      resolve(formatted);
    };

    media.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve('00:00:00');
    };

    media.src = objectUrl;
  });
};
