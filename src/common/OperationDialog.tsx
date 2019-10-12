import React from "react";
import clsx from "clsx";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  makeStyles,
  Typography
} from "@material-ui/core";

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
  content: {},
  contentInput: {
    display: "flex",
    flexDirection: "column"
  },
  contentProcess: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  processText: {
    margin: "0 10px"
  }
}));

export interface OperationResult {
  error: boolean;
  content: React.ReactNode;
}

export type OperationStep = "input" | "process" | OperationResult;

interface OperationDialogProps {
  step: OperationStep;
  title: React.ReactNode;
  titleColor: "default" | "dangerous" | "create";
  input?: React.ReactNode;
  inputPrompt?: React.ReactNode | string;
  onConfirm: () => void;
  open: boolean;
  close: () => void;
}

const OperationDialog: React.FC<OperationDialogProps> = props => {
  const classes = useStyles();
  const step = props.step;
  const isProcessing = step === "process";

  let body: React.ReactNode;
  if (step === "input") {
    let inputPrompt = props.inputPrompt;
    if (typeof inputPrompt === "string") {
      inputPrompt = <Typography variant="subtitle1">{inputPrompt}</Typography>;
    }
    body = (
      <>
        <DialogContent
          classes={{ root: clsx(classes.content, classes.contentInput) }}
        >
          {inputPrompt}
          {props.input}
        </DialogContent>
        <DialogActions>
          <Button onClick={props.close}>Cancel</Button>
          <Button color="secondary" onClick={props.onConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </>
    );
  } else if (step === "process") {
    body = (
      <DialogContent
        classes={{ root: clsx(classes.content, classes.contentProcess) }}
      >
        <CircularProgress />
        <span className={classes.processText}>Processing!</span>
      </DialogContent>
    );
  } else {
    let content: React.ReactNode;
    const result = step;
    if (result) {
      content = result.content;
      if (result.error) {
        if (typeof content === "string") {
          content = (
            <Typography color="error" variant="body1">
              {content}
            </Typography>
          );
        }
      } else {
        if (typeof content === "string") {
          content = <Typography variant="body1">{content}</Typography>;
        }
      }
    } else {
      console.error("OperationDialog: step is finish but result is falsy.");
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

OperationDialog.defaultProps = {
  titleColor: "default"
};

export default OperationDialog;
