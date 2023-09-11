import React, { useState, useEffect } from "react";
//import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { styled } from "@mui/system";
import { Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import AuthBox from "../components/AuthBox";
import { validateForgotPassword } from "../utils/validators";
import { forgotPassword } from "../api/api";
//import { useAppSelector } from "../store";
//import { registerUser } from "../actions/authActions";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Wrapper = styled("div")({
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    width: "100%",
});

const Label = styled("p")({
    color: "#b9bbbe",
    textTransform: "uppercase",
    fontWeight: "600",
    fontSize: "16px",
});

const Input = styled("input")({
    flexGrow: 1,
    height: "40px",
    border: "1px solid black",
    borderRadius: "5px",
    color: "#dcddde",
    background: "#35393f",
    margin: 0,
    fontSize: "16px",
    padding: "0 5px",
    outline: "none",
});

const RedirectText = styled("span")({
    color: "#00AFF4",
    fontWeight: 500,
    cursor: "pointer",
});

const ForgotPassword = () => {
      
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: "",
    });
    const [isFormValid, setIsFormValid] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = () => {
        forgotPassword(credentials)
        toast("Please check your email!");
    };

    useEffect(() => {
        setIsFormValid(validateForgotPassword(credentials));
    }, [credentials]);

    return (
        <AuthBox>
            <Typography variant="h5" sx={{ color: "white" }}>
                Forgot Password!!!
            </Typography>

            <Wrapper>
                <Label>Email</Label>
                <Input
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                />
            </Wrapper>

            <Tooltip
                title={
                    isFormValid
                        ? "Proceed to Register"
                        : "Enter correct email address. Password should be greater than six characters and username should be between 3 and 12 characters!"
                }
            >
                <div>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: "#5865F2",
                            color: "white",
                            textTransform: "none",
                            fontSize: "16px",
                            fontWeight: 500,
                            width: "100%",
                            height: "40px",
                            margin: "20px 0px",
                        }}
                        disabled={!isFormValid}
                        onClick={handleRegister}
                    >
                        Sign Up
                    </Button>
                </div>
                
            </Tooltip>
            <ToastContainer />
            <Typography sx={{ color: "#72767d" }} variant="subtitle2">
                {`Already have an account? `}
                <RedirectText onClick={() => navigate("/login")}>
                    Log In
                </RedirectText>
            </Typography>
        </AuthBox>
    );
};

export default ForgotPassword;
