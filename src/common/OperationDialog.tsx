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
  Checkbox
} from '@material-ui/core';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

export interface OperationTextInputInfo {
  type: 'text';
  label: string;
  password?: boolean;
  initValue?: string;
}

export interface OperationBoolInputInfo {
  type: 'bool';
  label: string;
  initValue?: boolean;
}

export type OperationInputInfo =
  | OperationTextInputInfo
  | OperationBoolInputInfo;

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
    flexDirection: 'column'
  },
  processText: {
    margin: '0 10px'
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

  type Step = 'input' | 'process' | OperationResult;
  const [step, setStep] = useState<Step>('input');
  const [values, setValues] = useState<(boolean | string)[]>(() => {
    return inputScheme.map(i => {
      if (i.type === 'bool') {
        return i.initValue || false;
      } else if (i.type === 'text') {
        return i.initValue || ('' as string);
      } else {
        throw new Error('Unknown input scheme.');
      }
    });
  });
  const [inputError, setInputError] = useState<OperationInputErrorInfo>(() => {
    if (props.validator) {
      const initValues = inputScheme.map(i => {
        if (i.type === 'bool') {
          return i.initValue || false;
        } else if (i.type === 'text') {
          return i.initValue || ('' as string);
        } else {
          throw new Error('Unknown input scheme.');
        }
      });
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
            const error = inputError[index];
            if (item.type === 'text') {
              return (
                <TextField
                  key={index}
                  label={item.label}
                  value={values[index]}
                  type={item.password === true ? 'password' : undefined}
                  error={error != null}
                  helperText={error && error(t)}
                  onChange={e => {
                    const v = e.target.value; // React may reuse the event, so copy and catch it.
                    const oldValues = values;
                    const newValues = oldValues.slice();
                    newValues[index] = v;
                    setValues(newValues);
                    if (props.validator) {
                      const result = props.validator(newValues, index);
                      if (result) {
                        setInputError(oldError => {
                          return { ...oldError, ...result };
                        });
                      }
                    }
                  }}
                />
              );
            } else if (item.type === 'bool') {
              return (
                <FormControlLabel
                  key={index}
                  value={values[index]}
                  onChange={e => {
                    const v = (e.target as HTMLInputElement).checked; // React may reuse the event, so copy and catch it.
                    const oldValues = values;
                    const newValues = oldValues.slice();
                    newValues[index] = v;
                    setValues(newValues);
                    if (props.validator) {
                      const result = props.validator(newValues, index);
                      if (result) {
                        setInputError(oldError => {
                          return { ...oldError, ...result };
                        });
                      }
                    }
                  }}
                  control={<Checkbox />}
                  label={item.label}
                />
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
