import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import { usePage } from "../contexts/PageContext";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
interface Tab {
  tabName: string;
  parentName: string;
  fullPath: string;
  path: string;
}

interface FormDialogProps {
  editMode?: boolean;
  initialData?: any;
}
export default function FormDialog({
  editMode = false,
  initialData = {},
}: FormDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [tabName, setTabName] = React.useState(
    editMode ? initialData.name || "" : ""
  );
  const [parentName, setParentName] = React.useState(
    editMode ? initialData.parentName || "" : ""
  );
  const [fullPath, setFullPath] = React.useState(
    editMode ? initialData.fullPath || "" : ""
  );
  const [path, setPath] = React.useState(
    editMode ? initialData.path || "" : ""
  );
  const [loadingData, setLoadingData] = React.useState(false);
  const [alertMessageOpen, setAlertMessageOpen] = React.useState(false);

  const {
    tabs,
    addTab,
    updateTab,
    fetchSelectableTabs,
    selectableTabs,
    succeeded,
  } = usePage(); // Assuming updateTab is a function to update tab
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  React.useEffect(() => {
    if (open && editMode) {
      // Call your fetch function here, you can use any id you want.
      // For this example, I'll use 1.
      fetchSelectableTabs(initialData._id);
    }
  }, [open]);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (!editMode) {
      setTabName("");
      setParentName("");
      setFullPath("");
      setPath("");
    }
    setOpen(false);
  };

  const handleAction = async (e: any) => {
    if (tabName === "") {
      setSnackbarOpen(true);
    } else {
      setLoadingData(true);

      try {
        e.preventDefault();
        if (editMode) {
          const updatedRow = tabs?.find((tab) => tab._id === initialData._id);
          if (updatedRow) {
            await updateTab({
              id: updatedRow._id,
              tabName: tabName,
              parentName: parentName,
              fullPath: fullPath,
              path: path,
            });
          }
          setAlertMessageOpen(true);
        } else {
          await addTab({
            tabName,
            parentName,
            fullPath,
            path,
          });
          setAlertMessageOpen(true);
        }
        handleClose();
      } catch (e) {
        setAlertMessageOpen(true);
      }

      setLoadingData(false);
    }
  };

  const handleSnackbarClose = (event: any, reason: any) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  return (
    <div>
      {!editMode ? (
        <Button variant="outlined" onClick={handleClickOpen}>
          + Add Page
        </Button>
      ) : (
        <IconButton aria-label="edit" color="primary" onClick={handleClickOpen}>
          <EditIcon />
        </IconButton>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? "Edit Page" : "Add New Page"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            required
            id="tab-name"
            label="Tab Name"
            type="text"
            fullWidth
            variant="standard"
            value={tabName}
            onChange={(e) => setTabName(e.target.value)}
          />

          <TextField
            id="parent-name"
            select
            label="Parent"
            margin="normal"
            fullWidth
            value={parentName}
            variant="standard"
            onChange={(e) => setParentName(e.target.value)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>

            {editMode
              ? selectableTabs?.map((tab) => (
                  <MenuItem key={tab._id} value={tab.name}>
                    {tab.name}
                  </MenuItem>
                ))
              : tabs?.map((tab) => (
                  <MenuItem key={tab._id} value={tab.name}>
                    {tab.name}
                  </MenuItem>
                ))}
          </TextField>
          <TextField
            autoFocus
            margin="normal"
            id="full-path"
            label="Full Path"
            type="text"
            fullWidth
            variant="standard"
            value={fullPath}
            onChange={(e) => setFullPath(e.target.value)}
          />
          <TextField
            autoFocus
            margin="normal"
            id="path"
            label="Path"
            type="text"
            fullWidth
            variant="standard"
            value={path}
            onChange={(e) => setPath(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAction} disabled={loadingData}>
            {loadingData ? (
              <CircularProgress size={24} />
            ) : editMode ? (
              "Save Changes"
            ) : (
              "Add"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="Tab name cannot be empty"
      />
      <Snackbar
        open={!!alertMessageOpen}
        autoHideDuration={3000}
        onClose={() => setAlertMessageOpen(false)}
      >
        <Alert
          onClose={() => setAlertMessageOpen(false)}
          severity={succeeded ? "success" : "error"}
        >
          {succeeded
            ? editMode
              ? "Tab successfully updated"
              : "Tab successfully added"
            : editMode
            ? "Tab is not updated"
            : "Tab is not updated"}
        </Alert>
      </Snackbar>
    </div>
  );
}
