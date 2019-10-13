import React, { useState } from "react";
import clsx from "clsx";
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
} from "@material-ui/core";

export interface OperationTextInputInfo {
  type: "text";
  label: string;
  initValue?: string;
}

export interface OperationBoolInputInfo {
  type: "bool";
  label: string;
  initValue?: boolean;
}

export type OperationInputInfo =
  | OperationTextInputInfo
  | OperationBoolInputInfo;

const useStyles = makeStyles(theme => ({
  paper: {
    minWidth: 220,
    minHeight: 140,
    [theme.breakpoints.up("md")]: {
      minWidth: 300,
      minHeight: 160
    }
  },
  titleCreate: {
    color: "green"
  },
  titleDangerous: {
    color: "red"
  },
  content: {
    display: "flex",
    flexDirection: "column"
  },
  processText: {
    margin: "0 10px"
  }
}));

interface OperationResult {
  type: "success" | "failure";
  value: any;
}

interface OperationDialogProps {
  title: React.ReactNode;
  titleColor: "default" | "dangerous" | "create";
  inputPrompt?: React.ReactNode;
  inputScheme?: OperationInputInfo[];
  onConfirm: (input: (string | boolean)[]) => Promise<any>;
  processPrompt?: () => React.ReactNode;
  successPrompt?: (value: any) => React.ReactNode;
  failurePrompt?: (error: any) => React.ReactNode;
  open: boolean;
  close: () => void;
}

const OperationDialog: React.FC<OperationDialogProps> = props => {
  const inputScheme = props.inputScheme;
  if (!inputScheme) {
    throw new Error(
      "InputScheme of operation dialog is falsy. Use empty array if no input needed, which is the default value."
    );
  }

  const classes = useStyles();

  type Step = "input" | "process" | OperationResult;
  const [step, setStep] = useState<Step>("input");
  const [values, setValues] = useState<(boolean | string)[]>(() => {
    return inputScheme.map(i => {
      if (i.type === "bool") {
        return i.initValue || false;
      } else if (i.type === "text") {
        return i.initValue || ("" as string);
      } else {
        throw new Error("Unknown input scheme.");
      }
    });
  });
  const isProcessing = step === "process";

  let body: React.ReactNode;
  if (step === "input") {
    let inputPrompt = props.inputPrompt;
    if (React.isValidElement(inputPrompt)) {
      inputPrompt = <Typography variant="subtitle1">{inputPrompt}</Typography>;
    }
    body = (
      <>
        <DialogContent classes={{ root: classes.content }}>
          {inputPrompt}
          {inputScheme.map((i, index) => {
            const type = i.type;
            if (type === "text") {
              return (
                <TextField
                  key={index}
                  label={i.label}
                  value={values[index]}
                  onChange={e => {
                    const v = e.target.value; // React may reuse the event, so copy and catch it.
                    setValues(oldValues => {
                      const newValues = oldValues.slice();
                      newValues[index] = v;
                      return newValues;
                    });
                  }}
                />
              );
            } else if (type === "bool") {
              return (
                <FormControlLabel
                  key={index}
                  value={values[index]}
                  onChange={e => {
                    const v = (e.target as HTMLInputElement).checked; // React may reuse the event, so copy and catch it.
                    setValues(oldValues => {
                      const newValues = oldValues.slice();
                      newValues[index] = v;
                      return newValues;
                    });
                  }}
                  control={<Checkbox />}
                  label={i.label}
                />
              );
            }
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={props.close}>Cancel</Button>
          <Button
            color="secondary"
            onClick={() => {
              setStep("process");
              props.onConfirm(values).then(
                v => {
                  setStep({
                    type: "success",
                    value: v
                  });
                },
                e => {
                  setStep({
                    type: "failure",
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
  } else if (step === "process") {
    body = (
      <DialogContent classes={{ root: classes.content }}>
        {props.processPrompt && props.processPrompt()}
      </DialogContent>
    );
  } else {
    let content: React.ReactNode;
    const result = step;
    if (result.type === "success") {
      content = props.successPrompt && props.successPrompt(result.value);
      if (React.isValidElement(content))
        content = <Typography variant="body1">{content}</Typography>;
    } else {
      content = props.failurePrompt && props.failurePrompt(result.value);
      if (React.isValidElement(content))
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
            props.titleColor === "create" && classes.titleCreate,
            props.titleColor === "dangerous" && classes.titleDangerous
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  processText: {
    margin: "0 10px"
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
  titleColor: "default",
  inputScheme: [],
  processPrompt: () => <DefaultProcessPrompt />,
  successPrompt: _ => "Ok!",
  failurePrompt: e => e.toString()
};

export default OperationDialog;
