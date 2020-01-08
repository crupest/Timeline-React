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
import { useTranslation } from 'react-i18next';
import { TextFieldProps } from '@material-ui/core/TextField';

export interface OperationTextInputInfo {
  type: 'text';
  label: string;
  initValue?: string;
  textFieldProps?: TextFieldProps;
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

interface OperationResult {
  type: 'success' | 'failure';
  data: unknown;
}

interface OperationDialogProps {
  open: boolean;
  close: () => void;
  title: React.ReactNode;
  titleColor: 'default' | 'dangerous' | 'create';
  inputScheme?: OperationInputInfo[];
  inputPrompt?: React.ReactNode;
  onConfirm: (inputs: (string | boolean)[]) => Promise<unknown>;
  processPrompt?: () => React.ReactNode;
  successPrompt?: (data: unknown) => React.ReactNode;
  failurePrompt?: (error: unknown) => React.ReactNode;
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

const OperationDialog: React.FC<OperationDialogProps> = props => {
  const inputScheme = props.inputScheme;
  if (inputScheme == null) {
    throw new Error(
      'InputScheme of operation dialog is null or undefined. Use empty array if no input needed, which is the default value.'
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

  const onConfirm = (): void => {
    setStep('process');
    props.onConfirm(values).then(
      d => {
        setStep({
          type: 'success',
          data: d
        });
      },
      e => {
        setStep({
          type: 'failure',
          data: e
        });
      }
    );
  };

  let body: React.ReactNode;
  if (step === 'input') {
    let inputPrompt = props.inputPrompt;
    if (typeof inputPrompt === 'string') {
      inputPrompt = <Typography variant="subtitle2">{inputPrompt}</Typography>;
    }

    const canConfirm: boolean = (() => {
      if (props.inputScheme != null) {
        const inputScheme = props.inputScheme;
        for (let i = 0; i < inputScheme.length; i++) {
          if (inputScheme[i].type === 'text' && inputError[i] != null) {
            return false;
          }
        }
        return true;
      } else {
        return true;
      }
    })();

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
            const error: string | undefined = (e => {
              if (typeof e === 'string') {
                return t(e);
              } else {
                return undefined;
              }
            })(inputError[index]);

            if (item.type === 'text') {
              return (
                <TextField
                  key={index}
                  classes={{ root: classes.inputText }}
                  fullWidth
                  label={item.label}
                  value={value}
                  error={error != null}
                  helperText={error}
                  onChange={e => {
                    setValue(e.target.value);
                  }}
                  {...item.textFieldProps}
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
          <Button onClick={props.close}>{t('operationDialog.cancel')}</Button>
          <Button color="primary" disabled={!canConfirm} onClick={onConfirm}>
            {t('operationDialog.confirm')}
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
      content = props.successPrompt && props.successPrompt(result.data);
      if (typeof content === 'string' || React.isValidElement(content))
        content = <Typography variant="body1">{content}</Typography>;
    } else {
      content = props.failurePrompt && props.failurePrompt(result.data);
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
            {t('operationDialog.ok')}
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
