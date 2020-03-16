import React from 'react';
import clsx from 'clsx';

import { ExcludeKey } from '../type-utilities';

export interface FileInputProps
  extends ExcludeKey<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'id'
  > {
  inputId?: string;
  labelText: string;
  color?: string;
  className?: string;
}

const FileInput: React.FC<FileInputProps> = props => {
  const { inputId, labelText, color, className, ...otherProps } = props;

  const realInputId = React.useMemo<string>(() => {
    if (inputId != null) return inputId;
    return (
      'file-input-' +
      (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    );
  }, [inputId]);

  return (
    <>
      <input className="d-none" type="file" id={realInputId} {...otherProps} />
      <label
        htmlFor={realInputId}
        className={clsx('btn', 'btn-' + (color ?? 'primary'), className)}
      >
        {labelText}
      </label>
    </>
  );
};

export default FileInput;
