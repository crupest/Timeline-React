import React from 'react';
import { Spinner } from 'reactstrap';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onButtonClick: () => void;
  className?: string;
  loading?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = props => {
  return (
    <div>
      <input
        value={props.value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          props.onChange(event.currentTarget.value);
        }}
        onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key === 'Enter') {
            props.onButtonClick();
          }
        }}
      />
      {props.loading ? (
        <Spinner />
      ) : (
        <i className="fas fa-search" onClick={props.onButtonClick} />
      )}
    </div>
  );
};

export default SearchInput;
