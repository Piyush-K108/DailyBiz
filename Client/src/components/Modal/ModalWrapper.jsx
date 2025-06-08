import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import {
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Button,
} from "@mui/material";
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

//import DialogContentText from '@mui/material//DialogContentText';
import Loader from "../Loader/Loader";

const ModalWrapper = (props) => {
  //const theme = useTheme();
  const isLoading = useSelector((state) => state.commonSilce.isLoading);
  //const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <React.Fragment>
      <Dialog
        fullWidth={true}
        maxWidth={props.size}
        open={props.isPopUpShow}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            props.toggleModel();
          }
        }}
        sx={props?.dialog_sx}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle
          id="max-width-dialog-title"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 2,
          }}
        >
          <Typography variant="h6">{props.heading}</Typography>
          <IconButton edge="end" onClick={props.toggleModel}>
            <CloseIcon style={{ color: "red" ,marginRight:"10px"}}/>
          </IconButton>
        </DialogTitle>

        {props.showDividerOnTop && <Divider />}
        <DialogContent sx={props?.dialogContent_sx}>
          {props.children}
        </DialogContent>
        <Divider />
        {!props.itemtables && (
          <DialogActions sx={props?.dialogActions_sx}>
            <Grid container justifyContent="flex-end" alignItems="center">
              <Grid item>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    color="info"
                    type="button"
                    variant="outlined"
                    onClick={props.toggleModel}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    onClick={(e) => {
                      if (!isLoading) props.onsubmit();
                      e.preventDefault();
                    }}
                  >
                    {isLoading ? (
                      <>
                        <span style={{ marginRight: "10px" }}>
                          <Loader isLoading={isLoading} />{" "}
                        </span>
                        {props.saveBtnTitle}{" "}
                      </>
                    ) : (
                      props.saveBtnTitle
                    )}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </DialogActions>
        )}
      </Dialog>
    </React.Fragment>
  );
};

ModalWrapper.propTypes = {
  heading: PropTypes.string.isRequired,
  isPopUpShow: PropTypes.bool.isRequired,
  size: PropTypes.string.isRequired,
  toggleModel: PropTypes.func.isRequired,
  onsubmit: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
  saveBtnTitle: PropTypes.string.isRequired,
};

export default ModalWrapper;
