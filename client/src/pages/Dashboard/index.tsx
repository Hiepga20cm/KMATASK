import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import { closeConnectWithServerAuth, connectWithSocketServer, UserDetails } from "../../socket/socketConnection";
import { useAppSelector } from "../../store";
import ResponsiveDrawer from "./Drawer";
import { store } from "../../store";
import { setConfig } from "../../actions/configAction";
import { getConfig } from "../../api/api";
const Wrapper = styled("div")({
    width: "100%",
    height: "100vh",
    display: "flex",
});

const Dashboard = () => {
    const {auth: {userDetails}, videoChat: {localStream}, room: { isUserInRoom, localStreamRoom }} = useAppSelector((state) => state);
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = userDetails?.token;

        if (!isLoggedIn) {
            navigate("/login");
        } else {
            // connect to socket server
            closeConnectWithServerAuth();
            connectWithSocketServer(userDetails as UserDetails);
            getConfig().then((config) => { store.dispatch(setConfig(config?.salt, parseInt(config?.p), parseInt(config?.g)) as any)})
        }

    }, [userDetails, navigate]);


    return (
        <Wrapper>
            <ResponsiveDrawer localStream={localStream || localStreamRoom} isUserInRoom={isUserInRoom} />
        </Wrapper>
    );
};

export default Dashboard;
