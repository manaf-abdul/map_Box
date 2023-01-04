import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog(props) {

  return (
    <div>
      <Dialog
        {...props}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Once you delete you can't recover the data
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.deleteHandler} style={{ backgroundColor: "green", color: "white" }}>Yes</Button>
          <Button onClick={props.onClose} style={{ backgroundColor: "#e74c3c", color: "white" }} autoFocus>No</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
