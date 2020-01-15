import React from 'react';
import clsx from 'clsx';
import {
  makeStyles,
  Theme,
  Paper,
  IconButton,
  Icon,
  InputBase,
  InputBaseProps,
  CircularProgress
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    marginLeft: theme.spacing(1),
    flexGrow: 1
  },
  rightArea: {
    flex: '0 0 auto'
  },
  loading: {
    padding: '9px'
  }
}));

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onButtonClick: () => void;
  className?: string;
  loading?: boolean;
  buttonIcon?: React.ReactElement;
  inputProps?: Pick<
    InputBaseProps,
    Exclude<keyof InputBaseProps, 'value' | 'onChange'>
  >;
}

const SearchInput: React.FC<SearchInputProps> = props => {
  const classes = useStyles();
  return (
    <Paper component="div" className={clsx(classes.paper, props.className)}>
      <InputBase
        className={classes.input}
        value={props.value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          props.onChange(event.currentTarget.value);
        }}
        {...props.inputProps}
      />
      {props.loading ? (
        <CircularProgress
          size={30}
          className={clsx(classes.rightArea, classes.loading)}
        />
      ) : (
        <IconButton
          className={clsx(classes.rightArea)}
          onClick={props.onButtonClick}
        >
          {props.buttonIcon ?? <Icon>search</Icon>}
        </IconButton>
      )}
    </Paper>
  );
};

export default SearchInput;
