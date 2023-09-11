import React, { useState, useEffect } from "react";
//import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { styled } from "@mui/system";
import { Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import AuthBox from "../components/AuthBox";
import { validateResetPassword } from "../utils/validators";
import { resetPassword } from "../api/api";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const ResetPassword = () => {
  const navigate = useNavigate();
  const token: any = useParams();

  const [credentials, setCredentials] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleResetPassword = async () => {
    // forgotPassword(credentials)
    const notify = await resetPassword(credentials, token);
    if (notify) {
      toast("Change password successfully");
    }
  };

  useEffect(() => {
    setIsFormValid(validateResetPassword(credentials));
  }, [credentials]);

  return (
    <AuthBox>
      <Typography variant="h5" sx={{ color: "white" }}>
        Forgot Password!!!
      </Typography>

      <Wrapper>
        <Label>Password</Label>
        <Input
          type="password"
          placeholder="Enter your new password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
        />
        <Label>Confirm Password</Label>
        <Input
          type="password"
          placeholder="Confirm your new password"
          name="confirmPassword"
          value={credentials.confirmPassword}
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
            onClick={handleResetPassword}
          >
            Reset password
          </Button>
        </div>
      </Tooltip>
      <ToastContainer />
      <Typography sx={{ color: "#72767d" }} variant="subtitle2">
        {`Already have an account? `}
        <RedirectText onClick={() => navigate("/login")}>Log In</RedirectText>
      </Typography>
    </AuthBox>
  );
};

export default ResetPassword;
