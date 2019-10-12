import React from "react";
import clsx from "clsx";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  makeStyles
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

export type OperationStep = "input" | "process" | "finish";

interface OperationDialogProps {
  step: OperationStep;
  title: React.ReactNode;
  titleColor: "default" | "dangerous" | "create";
  input: React.ReactNode;
  onConfirm: () => void;
  open: boolean;
  close: () => void;
}

const OperationDialog: React.FC<OperationDialogProps> = props => {
  const classes = useStyles();
  const step = props.step;
  const isProcessing = step === "process";

  let body: React.ReactNode;
  switch (step) {
    case "input":
      body = (
        <>
          <DialogContent
            classes={{ root: clsx(classes.content, classes.contentInput) }}
          >
            {props.input}
          </DialogContent>
          <DialogActions>
            <Button onClick={props.close}>Cancel</Button>
            <Button color="secondary" onClick={props.onConfirm}>Confirm</Button>
          </DialogActions>
        </>
      );
      break;
    case "process":
      body = (
        <DialogContent
          classes={{ root: clsx(classes.content, classes.contentProcess) }}
        >
          <CircularProgress />
          <span className={classes.processText}>Processing!</span>
        </DialogContent>
      );
      break;
    case "finish":
      body = (
        <>
          <DialogContent classes={{ root: classes.content }}>Ok!</DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={props.close}>Ok</Button>
          </DialogActions>
        </>
      );
      break;
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
