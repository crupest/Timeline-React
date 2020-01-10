import React, { useState } from 'react';
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
  const { t } = useTranslation();
  return (
    <div className={classes.processContent}>
      <CircularProgress />
      <span className={classes.processText}>
        {t('operationDialog.processing')}
      </span>
    </div>
  );
};

interface DefaultErrorPromptProps {
  error?: string;
}

const DefaultErrorPrompt: React.FC<DefaultErrorPromptProps> = props => {
  const { t } = useTranslation();

  let result = (
    <Typography color="error" variant="body1">
      {t('operationDialog.error')}
    </Typography>
  );

  if (props.error != null) {
    result = (
      <>
        {result}
        <Typography color="error" variant="body1">
          {props.error}
        </Typography>
      </>
    );
  }

  return result;
};

export type OperationInputOptionalError = undefined | null | string;

export interface OperationInputErrorInfo {
  [index: number]: OperationInputOptionalError;
}

export type OperationInputValidator<TValue> = (
  value: TValue,
  values: (string | boolean)[]
) => OperationInputOptionalError | OperationInputErrorInfo;

export interface OperationTextInputInfo {
  type: 'text';
  label: string;
  initValue?: string;
  textFieldProps?: TextFieldProps;
  validator?: OperationInputValidator<string>;
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
  titleColor?: 'default' | 'dangerous' | 'create';
  onProcess: (inputs: (string | boolean)[]) => Promise<unknown>;
  inputScheme?: OperationInputInfo[];
  inputPrompt?: string | (() => React.ReactNode);
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

  type Step = 'input' | 'process' | OperationResult;
  const [step, setStep] = useState<Step>('input');
  const [values, setValues] = useState<(boolean | string)[]>(
    inputScheme.map(i => {
      if (i.type === 'bool') {
        return i.initValue ?? false;
      } else if (i.type === 'text' || i.type === 'select') {
        return i.initValue ?? '';
      } else {
        throw new Error('Unknown input scheme.');
      }
    })
  );
  const [inputError, setInputError] = useState<OperationInputErrorInfo>({});
  const isProcessing = step === 'process';

  const onConfirm = (): void => {
    setStep('process');
    props.onProcess(values).then(
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
    let inputPrompt =
      typeof props.inputPrompt === 'function'
        ? props.inputPrompt()
        : props.inputPrompt;
    if (typeof inputPrompt === 'string') {
      inputPrompt = <Typography variant="subtitle2">{inputPrompt}</Typography>;
    }

    const updateValue = (
      index: number,
      newValue: string | boolean
    ): (string | boolean)[] => {
      const oldValues = values;
      const newValues = oldValues.slice();
      newValues[index] = newValue;
      setValues(newValues);
      return newValues;
    };

    const testErrorInfo = (errorInfo: OperationInputErrorInfo): boolean => {
      if (props.inputScheme != null) {
        const inputScheme = props.inputScheme;
        for (let i = 0; i < inputScheme.length; i++) {
          if (inputScheme[i].type === 'text' && errorInfo[i] != null) {
            return true;
          }
        }
        return false;
      } else {
        return false;
      }
    };

    const calculateError = (
      oldError: OperationInputErrorInfo,
      index: number,
      newError: OperationInputOptionalError | OperationInputErrorInfo
    ): OperationInputErrorInfo => {
      if (newError === undefined) {
        return oldError;
      } else if (newError === null || typeof newError === 'string') {
        return { ...oldError, [index]: newError };
      } else {
        const newInputError: OperationInputErrorInfo = { ...oldError };
        for (const [index, error] of Object.entries(newError)) {
          if (error !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (newInputError as any)[index] = error;
          }
        }
        return newInputError;
      }
    };

    const validateAll = (): boolean => {
      let newInputError = inputError;
      for (let i = 0; i < inputScheme.length; i++) {
        const item = inputScheme[i];
        if (item.type === 'text') {
          newInputError = calculateError(
            newInputError,
            i,
            item.validator?.(values[i] as string, values)
          );
        }
      }
      const result = !testErrorInfo(newInputError);
      setInputError(newInputError);
      return result;
    };

    body = (
      <>
        <DialogContent classes={{ root: classes.content }}>
          {inputPrompt}
          {inputScheme.map((item, index) => {
            const value = values[index];
            const error: string | undefined = (e =>
              typeof e === 'string' ? t(e) : undefined)(inputError?.[index]);

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
                    const v = e.target.value;
                    const newValues = updateValue(index, v);
                    setInputError(
                      calculateError(
                        inputError,
                        index,
                        item.validator?.(v, newValues)
                      )
                    );
                  }}
                  {...item.textFieldProps}
                />
              );
            } else if (item.type === 'bool') {
              return (
                <FormControlLabel
                  key={index}
                  value={value}
                  onChange={e => {
                    updateValue(index, (e.target as HTMLInputElement).checked);
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
                      updateValue(index, event.target.value as string);
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
          <Button
            color="primary"
            disabled={testErrorInfo(inputError)}
            onClick={() => {
              if (validateAll()) {
                onConfirm();
              }
            }}
          >
            {t('operationDialog.confirm')}
          </Button>
        </DialogActions>
      </>
    );
  } else if (step === 'process') {
    body = (
      <DialogContent classes={{ root: classes.content }}>
        {props.processPrompt?.() ?? <DefaultProcessPrompt />}
      </DialogContent>
    );
  } else {
    let content: React.ReactNode;
    const result = step;
    if (result.type === 'success') {
      content =
        props.successPrompt?.(result.data) ?? t('operationDialog.success');
      if (typeof content === 'string')
        content = <Typography variant="body1">{content}</Typography>;
    } else {
      content = props.failurePrompt?.(result.data) ?? <DefaultErrorPrompt />;
      if (typeof content === 'string')
        content = <DefaultErrorPrompt error={content} />;
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

export default OperationDialog;
