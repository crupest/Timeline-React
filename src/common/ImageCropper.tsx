import * as React from 'react';
import clsx from 'clsx';

export interface Clip {
  left: number;
  top: number;
  width: number;
}

interface NormailizedClip extends Clip {
  height: number;
}

interface ImageInfo {
  width: number;
  height: number;
  landscape: boolean;
  ratio: number;
  maxClipWidth: number;
  maxClipHeight: number;
}

interface ImageCropperSavedState {
  clip: NormailizedClip;
  x: number;
  y: number;
  pointerId: number;
}

export interface ImageCropperProps {
  clip: Clip | null;
  imageUrl: string;
  onChange: (clip: Clip) => void;
  imageElementCallback?: (element: HTMLImageElement | null) => void;
  className?: string;
}

const ImageCropper = (props: ImageCropperProps): React.ReactElement => {
  const { clip, imageUrl, onChange, imageElementCallback, className } = props;

  const [oldState, setOldState] = React.useState<ImageCropperSavedState | null>(
    null
  );
  const [imageInfo, setImageInfo] = React.useState<ImageInfo | null>(null);

  const normalizeClip = (c: Clip | null | undefined): NormailizedClip => {
    if (c == null) {
      return { left: 0, top: 0, width: 0, height: 0 };
    }

    return {
      left: c.left || 0,
      top: c.top || 0,
      width: c.width || 0,
      height: imageInfo != null ? (c.width || 0) / imageInfo.ratio : 0,
    };
  };

  const c = normalizeClip(clip);

  const imgElement = React.useRef<HTMLImageElement | null>(null);

  const onImageRef = React.useCallback(
    (e: HTMLImageElement | null) => {
      imgElement.current = e;
      if (imageElementCallback != null && e == null) {
        imageElementCallback(null);
      }
    },
    [imageElementCallback]
  );

  const onImageLoad = React.useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      const landscape = img.naturalWidth >= img.naturalHeight;

      const info = {
        width: img.naturalWidth,
        height: img.naturalHeight,
        landscape,
        ratio: img.naturalHeight / img.naturalWidth,
        maxClipWidth: landscape ? img.naturalHeight / img.naturalWidth : 1,
        maxClipHeight: landscape ? 1 : img.naturalWidth / img.naturalHeight,
      };
      setImageInfo(info);
      onChange({ left: 0, top: 0, width: info.maxClipWidth });
      if (imageElementCallback != null) {
        imageElementCallback(img);
      }
    },
    [onChange, imageElementCallback]
  );

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      if (oldState != null) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      setOldState({
        x: e.clientX,
        y: e.clientY,
        clip: c,
        pointerId: e.pointerId,
      });
    },
    [oldState, c]
  );

  const onPointerUp = React.useCallback(
    (e: React.PointerEvent) => {
      if (oldState == null || oldState.pointerId !== e.pointerId) return;
      e.currentTarget.releasePointerCapture(e.pointerId);
      setOldState(null);
    },
    [oldState]
  );

  const onPointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (oldState == null) return;

      const oldClip = oldState.clip;

      const movement = { x: e.clientX - oldState.x, y: e.clientY - oldState.y };

      const moveRatio = {
        x: movement.x / imgElement.current!.width,
        y: movement.y / imgElement.current!.height,
      };

      const newRatio = {
        x: oldClip.left + moveRatio.x,
        y: oldClip.top + moveRatio.y,
      };
      if (newRatio.x < 0) {
        newRatio.x = 0;
      } else if (newRatio.x > 1 - oldClip.width) {
        newRatio.x = 1 - oldClip.width;
      }
      if (newRatio.y < 0) {
        newRatio.y = 0;
      } else if (newRatio.y > 1 - oldClip.height) {
        newRatio.y = 1 - oldClip.height;
      }

      onChange({ left: newRatio.x, top: newRatio.y, width: oldClip.width });
    },
    [oldState, onChange]
  );

  const onHandlerPointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (oldState == null) return;

      const oldClip = oldState.clip;

      const movement = { x: e.clientX - oldState.x, y: e.clientY - oldState.y };

      const ratio = imageInfo == null ? 1 : imageInfo.ratio;

      const moveRatio = {
        x: movement.x / imgElement.current!.width,
        y: movement.x / imgElement.current!.width / ratio,
      };

      const newRatio = {
        x: oldClip.width + moveRatio.x,
        y: oldClip.height + moveRatio.y,
      };

      const maxRatio = {
        x: Math.min(1 - oldClip.left, newRatio.x),
        y: Math.min(1 - oldClip.top, newRatio.y),
      };

      const maxWidthRatio = Math.min(maxRatio.x, maxRatio.y * ratio);

      let newWidth;
      if (newRatio.x < 0) {
        newWidth = 0;
      } else if (newRatio.x > maxWidthRatio) {
        newWidth = maxWidthRatio;
      } else {
        newWidth = newRatio.x;
      }

      onChange({ left: oldClip.left, top: oldClip.top, width: newWidth });
    },
    [imageInfo, oldState, onChange]
  );

  // fuck!!! I just can't find a better way to implement this in pure css
  const containerStyle: React.CSSProperties = (() => {
    if (imageInfo == null) {
      return { width: '100%', paddingTop: '100%', height: 0 };
    } else {
      if (imageInfo.ratio > 1) {
        return {
          width: 100 / imageInfo.ratio + '%',
          paddingTop: '100%',
          height: 0,
        };
      } else {
        return {
          width: '100%',
          paddingTop: 100 * imageInfo.ratio + '%',
          height: 0,
        };
      }
    }
  })();

  return (
    <div
      className={clsx('image-cropper-container', className)}
      style={containerStyle}
    >
      <img ref={onImageRef} src={imageUrl} onLoad={onImageLoad} alt="to crop" />
      <div className="image-cropper-mask-container">
        <div
          className="image-cropper-mask"
          touch-action="none"
          style={{
            left: c.left * 100 + '%',
            top: c.top * 100 + '%',
            width: c.width * 100 + '%',
            height: c.height * 100 + '%',
          }}
          onPointerMove={onPointerMove}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        />
      </div>
      <div
        className="image-cropper-handler"
        touch-action="none"
        style={{
          left: 'calc(' + (c.left + c.width) * 100 + '% - 15px)',
          top: 'calc(' + (c.top + c.height) * 100 + '% - 15px)',
        }}
        onPointerMove={onHandlerPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      />
    </div>
  );
};

export default ImageCropper;

export function applyClipToImage(
  image: HTMLImageElement,
  clip: Clip,
  mimeType: string
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const naturalSize = {
      width: image.naturalWidth,
      height: image.naturalHeight,
    };
    const clipArea = {
      x: naturalSize.width * clip.left,
      y: naturalSize.height * clip.top,
      length: naturalSize.width * clip.width,
    };

    const canvas = document.createElement('canvas');
    canvas.width = clipArea.length;
    canvas.height = clipArea.length;
    const context = canvas.getContext('2d');

    if (context == null) throw new Error('Failed to create context.');

    context.drawImage(
      image,
      clipArea.x,
      clipArea.y,
      clipArea.length,
      clipArea.length,
      0,
      0,
      clipArea.length,
      clipArea.length
    );

    canvas.toBlob((blob) => {
      if (blob == null) {
        reject(new Error('canvas.toBlob returns null'));
      } else {
        resolve(blob);
      }
    }, mimeType);
  });
}
