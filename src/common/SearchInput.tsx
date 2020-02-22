import React from 'react';
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
}

const SearchInput: React.FC<SearchInputProps> = props => {
  const { t } = useTranslation();

  return (
    <div className="form-inline my-2">
      <Input
        className="mr-sm-2"
        value={props.value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          props.onChange(event.currentTarget.value);
        }}
        onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key === 'Enter') {
            props.onButtonClick();
          }
        }}
        placeholder={props.placeholder}
      />
      <div className="d-sm-none flex-grow-1 width-1px" />
      {props.loading ? (
        <Spinner />
      ) : (
        <Button
          outline
          color="primary"
          className=" mt-2 mt-sm-0"
          onClick={props.onButtonClick}
        >
          {props.buttonText ?? t('search')}
        </Button>
      )}
    </div>
  );
};

export default SearchInput;
