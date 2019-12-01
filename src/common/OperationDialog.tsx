import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  makeStyles,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemIcon
} from '@material-ui/core';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { TextFieldProps } from '@material-ui/core/TextField';

export interface OperationTextInputInfo {
  type: 'text';
  label: string;
  password?: boolean;
  initValue?: string;
  variant?: TextFieldProps['variant'];
  multiline?: boolean;
}

export interface OperationBoolInputInfo {
  type: 'bool';
  label: string;
  initValue?: boolean;
}

export interface OperationSelectInputInfoOption {
  value: string;
  label: string;
  icon?: React.ReactElement;
}

export interface OperationSelectInputInfo {
  type: 'select';
  label: string;
  options: OperationSelectInputInfoOption[];
  initValue?: string;
}

export type OperationInputInfo =
  | OperationTextInputInfo
  | OperationBoolInputInfo
  | OperationSelectInputInfo;

export interface OperationInputErrorInfo {
  [index: number]: ((t: TFunction) => string) | null | undefined;
}

const useStyles = makeStyles(theme => ({
  paper: {
    minWidth: 220,
    minHeight: 140,
    [theme.breakpoints.up('md')]: {
      minWidth: 300,
      minHeight: 160
    }
  },
  titleCreate: {
    color: 'green'
  },
  titleDangerous: {
    color: 'red'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start'
  },
  processText: {
    margin: '0 10px'
  },
  inputText: {
    margin: '10px 0'
  }
}));

interface OperationResult {
  type: 'success' | 'failure';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

interface OperationDialogProps {
  title: React.ReactNode;
  titleColor: 'default' | 'dangerous' | 'create';
  inputPrompt?: React.ReactNode;
  inputScheme?: OperationInputInfo[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onConfirm: (inputs: (string | boolean)[]) => Promise<any>;
  processPrompt?: () => React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  successPrompt?: (value: any) => React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  failurePrompt?: (error: any) => React.ReactNode;
  open: boolean;
  close: () => void;
  validator?: (
    inputs: (string | boolean)[],
    index?: number
  ) => OperationInputErrorInfo | void;
}

const OperationDialog: React.FC<OperationDialogProps> = props => {
  const inputScheme = props.inputScheme;
  if (!inputScheme) {
    throw new Error(
      'InputScheme of operation dialog is falsy. Use empty array if no input needed, which is the default value.'
    );
  }

  const classes = useStyles();
  const { t } = useTranslation();

  const initValues = useMemo(() => {
    return inputScheme.map(i => {
      if (i.type === 'bool') {
        return i.initValue || false;
      } else if (i.type === 'text' || i.type === 'select') {
        return i.initValue || '';
      } else {
        throw new Error('Unknown input scheme.');
      }
    });
  }, [inputScheme]);

  type Step = 'input' | 'process' | OperationResult;
  const [step, setStep] = useState<Step>('input');
  const [values, setValues] = useState<(boolean | string)[]>(initValues);
  const [inputError, setInputError] = useState<OperationInputErrorInfo>(() => {
    if (props.validator) {
      const result = props.validator(initValues);
      return result ? result : {};
    }
    return {};
  });
  const isProcessing = step === 'process';

  let body: React.ReactNode;
  if (step === 'input') {
    let inputPrompt = props.inputPrompt;
    if (typeof inputPrompt === 'string' || React.isValidElement(inputPrompt)) {
      inputPrompt = <Typography variant="subtitle2">{inputPrompt}</Typography>;
    }
    body = (
      <>
        <DialogContent classes={{ root: classes.content }}>
          {inputPrompt}
          {inputScheme.map((item, index) => {
            const setValue = (
              newValue: string | boolean
            ): (string | boolean)[] => {
              const oldValues = values;
              const newValues = oldValues.slice();
              newValues[index] = newValue;
              setValues(newValues);
              if (props.validator) {
                const result = props.validator(newValues, index);
                if (result) {
                  setInputError(oldError => {
                    return { ...oldError, ...result };
                  });
                }
              }
              return newValues;
            };

            const value = values[index];
            const error = inputError[index];

            if (item.type === 'text') {
              const variant = item.variant || 'standard';
              return (
                // I don't known what's wrong with typescript.
                // With any way I can come up with, I can't get this component pass type check.
                // The only lucky thing is that I find a way to disable it.
                // eslint-disable-next-line
                // @ts-ignore
                <TextField
                  key={index}
                  variant={variant}
                  classes={{root: classes.inputText}}
                  fullWidth
                  multiline={item.multiline}
                  label={item.label}
                  value={values[index]}
                  type={item.password === true ? 'password' : undefined}
                  error={error != null}
                  helperText={error && error(t)}
                  onChange={e => {
                    setValue(e.target.value);
                  }}
                />
              );
            } else if (item.type === 'bool') {
              return (
                <FormControlLabel
                  key={index}
                  value={values[index]}
                  onChange={e => {
                    setValue((e.target as HTMLInputElement).checked);
                  }}
                  control={<Checkbox />}
                  label={item.label}
                />
              );
            } else if (item.type === 'select') {
              return (
                <FormControl key={index}>
                  <InputLabel>{item.label}</InputLabel>
                  <Select
                    value={value}
                    onChange={event => {
                      setValue(event.target.value as string);
                    }}
                  >
                    {item.options.map((option, i) => {
                      return (
                        <MenuItem value={option.value} key={i}>
                          {option.icon && (
                            <ListItemIcon>{option.icon}</ListItemIcon>
                          )}
                          {option.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              );
            }
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={props.close}>Cancel</Button>
          <Button
            color="secondary"
            disabled={
              props.inputScheme
                ? (() => {
                    const inputScheme = props.inputScheme;
                    for (let i = 0; i < inputScheme.length; i++) {
                      if (
                        inputScheme[i].type === 'text' &&
                        inputError[i] != null
                      ) {
                        return true;
                      }
                    }
                    return false;
                  })()
                : false
            }
            onClick={() => {
              setStep('process');
              props.onConfirm(values).then(
                v => {
                  setStep({
                    type: 'success',
                    value: v
                  });
                },
                e => {
                  setStep({
                    type: 'failure',
                    value: e
                  });
                }
              );
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </>
    );
  } else if (step === 'process') {
    body = (
      <DialogContent classes={{ root: classes.content }}>
        {props.processPrompt && props.processPrompt()}
      </DialogContent>
    );
  } else {
    let content: React.ReactNode;
    const result = step;
    if (result.type === 'success') {
      content = props.successPrompt && props.successPrompt(result.value);
      if (typeof content === 'string' || React.isValidElement(content))
        content = <Typography variant="body1">{content}</Typography>;
    } else {
      content = props.failurePrompt && props.failurePrompt(result.value);
      if (typeof content === 'string' || React.isValidElement(content))
        content = (
          <Typography color="error" variant="body1">
            {content}
          </Typography>
        );
    }
    body = (
      <>
        <DialogContent classes={{ root: classes.content }}>
          {content}
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={props.close}>
            Ok
          </Button>
        </DialogActions>
      </>
    );
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.close}
      disableBackdropClick={isProcessing}
      disableEscapeKeyDown={isProcessing}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle
        classes={{
          root: clsx(
            props.titleColor === 'create' && classes.titleCreate,
            props.titleColor === 'dangerous' && classes.titleDangerous
          )
        }}
      >
        {props.title}
      </DialogTitle>
      {body}
    </Dialog>
  );
};

const useProcessStyles = makeStyles({
  processContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  processText: {
    margin: '0 10px'
  }
});

const DefaultProcessPrompt: React.FC = _ => {
  const classes = useProcessStyles();
  return (
    <div className={classes.processContent}>
      <CircularProgress />
      <span className={classes.processText}>Processing!</span>
    </div>
  );
};

OperationDialog.defaultProps = {
  titleColor: 'default',
  inputScheme: [],
  // eslint-disable-next-line react/display-name
  processPrompt: () => <DefaultProcessPrompt />,
  successPrompt: _ => 'Ok!',
  failurePrompt: e => e.toString()
};

export default OperationDialog;
