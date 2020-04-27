import React, { useCallback } from 'react';
import clsx from 'clsx';
import { Spinner, Input, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onButtonClick: () => void;
  className?: string;
  loading?: boolean;
  buttonText?: string;
  placeholder?: string;
  additionalButton?: React.ReactNode;
}

const SearchInput: React.FC<SearchInputProps> = (props) => {
  const { onChange, onButtonClick } = props;

  const { t } = useTranslation();

  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      onChange(event.currentTarget.value);
    },
    [onChange]
  );

  const onInputKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>): void => {
      if (event.key === 'Enter') {
        onButtonClick();
      }
    },
    [onButtonClick]
  );

  return (
    <div className={clsx('form-inline my-2', props.className)}>
      <Input
        className="mr-sm-2"
        value={props.value}
        onChange={onInputChange}
        onKeyPress={onInputKeyPress}
        placeholder={props.placeholder}
      />
      <div className="mt-2 mt-sm-0 order-sm-last ml-sm-3">
        {props.additionalButton}
      </div>
      <div className="mt-2 mt-sm-0 ml-auto ml-sm-0">
        {props.loading ? (
          <Spinner />
        ) : (
          <Button outline color="primary" onClick={props.onButtonClick}>
            {props.buttonText ?? t('search')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
