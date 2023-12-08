import React, { Fragment } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import Avatar from "../../../../components/Avatar";
import { Menu } from "@mui/material";
//import MoreVertIcon from "@mui/icons-material/MoreVert";
//import MenuItem from "@mui/material/MenuItem";
//import { useDispatch } from "react-redux";

interface GroupChatDetails {
  groupId: string;
  groupName: string;
  participants: Array<{
    _id: string;
    username: string;
    email: string;
  }>;
  admin: {
    _id: string;
    username: string;
    email: string;
  };
}

interface Props {
  isDialogOpen: boolean;
  closeDialogHandler: () => void;
  groupDetails: GroupChatDetails;
  currentUserId: string;
}

const GroupParticipantsDialog = ({
  isDialogOpen,
  closeDialogHandler,
  groupDetails,
  currentUserId,
}: Props) => {
  const handleCloseDialog = () => {
    closeDialogHandler();
  };
  //const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  //const [userDelete,setUserDelete] = useState('')
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  // const handleDeleteUserFromGroup = (userId: any) => {
  //   // dispatch(deleteUserGromGroupAction({
  //   //     userId: userId
  //   // }))
  //   console.log(userId);
  // };
  return (
    <div>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          <Typography>{groupDetails.groupName}</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography>
              {groupDetails.participants.length}{" "}
              {groupDetails.participants.length > 1
                ? "Participants"
                : "Participant"}
            </Typography>
          </DialogContentText>
          <List
            sx={{
              width: "100%",
              maxWidth: 300,
              bgcolor: "background.paper",
            }}
          >
            {groupDetails.participants.map((participant) => {
              return (
                <Fragment key={participant._id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar username={participant.username} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${participant.username} ${
                        participant._id === currentUserId ? "(You)" : ""
                      }`}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{
                              display: "inline",
                            }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {participant.email}
                          </Typography>
                          {` ${
                            participant._id === groupDetails.admin?._id
                              ? " — Group Admin"
                              : ""
                          }`}
                        </React.Fragment>
                      }
                    />
                    {currentUserId === groupDetails.admin?._id &&
                    participant._id !== groupDetails.admin?._id ? (
                      <>
                        {/* <IconButton
                          onClick={(e) => {setAnchorEl(e.currentTarget) ; setUserDelete(participant._id)}}
                          style={{ color: "black", marginLeft: "0px" }}
                        >
                          <MoreVertIcon />
                        </IconButton> */}
                        <Menu
                          id="basic-menu"
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleMenuClose}
                          MenuListProps={{
                            "aria-labelledby": "basic-button",
                          }}
                        >
                          {/* <MenuItem
                            onClick={() => {
                              handleDeleteUserFromGroup(userDelete);
                            }}
                          >
                            Delete User From Group
                          </MenuItem> */}
                        </Menu>
                      </>
                    ) : null}
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </Fragment>
              );
            })}
          </List>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupParticipantsDialog;
