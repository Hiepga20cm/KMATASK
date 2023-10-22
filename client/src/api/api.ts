import axios from "axios";
import {
  LoginArgs,
  AuthResponse,
  RegisterArgs,
  InviteFriendArgs,
  GetMeResponse,
  AddMembersToGroupArgs,
  LeaveGroupArgs,
  RemoveFriendArgs,
  DeleteGroupArgs,
  ForgotPasswordResponse,
  ResetPasswordArgs,
  RegisterResponse,
} from "./types";
//import jwtDecode from "jwt-decode";

const BASE_URL = "http://192.168.1.92:5000";
// const BASE_URL = "https://saliks-discord.herokuapp.com/";
// const BASE_URL = "https://talkhouse-server.onrender.com/";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
});

api.interceptors.request.use(
  async (config) => {
    const userDetails: any = localStorage.getItem("currentUser");

    if (userDetails) {
      const token = JSON.parse(userDetails).token;
      config.headers!["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export const forgotPassword = async ({ email }: ResetPasswordArgs) => {
  try {
    const res = await api.post<ForgotPasswordResponse>(
      "/api/auth/forgotPassword",
      {
        email,
      }
    );
    return res.data;
  } catch (error: any) {
    return {
      error: true,
      message: error.response.data,
    };
  }
};
export const resetPassword = async (confirmPassword: any, token: any) => {
  try {
    const pass = confirmPassword.confirmPassword;
    const accessToken = token.token;
    const res = await api.post(`/api/auth/reset-password`, {
      pass,
      accessToken,
    });
    return res.data;
  } catch (error: any) {
    return {
      error: true,
      message: error.response.data,
    };
  }
};

const logOut = () => {
  localStorage.clear();
  window.location.pathname = "/login";
};

const checkForAuthorization = (error: any) => {
  const responseCode = error?.response?.status;

  if (responseCode) {
    responseCode === 401 && logOut();
  }
};

export const login = async ({ email, password }: LoginArgs) => {
  try {
    const res = await api.post<AuthResponse>("/api/auth/login", {
      email,
      password,
    });

    return res.data;
  } catch (err: any) {
    return {
      error: true,
      message: err.response.data,
    };
  }
};

export const register = async ({ email, password, username }: RegisterArgs) => {
  try {
    //const res = await api.post<AuthResponse>("/api/auth/register", {
    const res = await api.post<RegisterResponse>("/api/auth/register", {
      email,
      password,
      username,
    });
    return res;
  } catch (err: any) {
    return {
      error: true,
      message: err.response.data,
    };
  }
};

// protected routes

export const getMe = async () => {
  try {
    const res = await api.get<GetMeResponse>("/api/auth/me");

    return {
      me: res.data.me,
      statusCode: 200,
    };
  } catch (err: any) {
    return {
      error: true,
      message: err.response.data,
      statusCode: err?.response?.status,
    };
  }
};

export const inviteFriendRequest = async ({ email }: InviteFriendArgs) => {
  try {
    const res = await api.post("/api/invite-friend/invite", {
      email,
    });

    return res.data;
  } catch (err: any) {
    checkForAuthorization(err);
    return {
      error: true,
      message: err.response.data,
    };
  }
};

export const rejectFriendRequest = async (invitationId: string) => {
  try {
    const res = await api.post("/api/invite-friend/reject", {
      invitationId,
    });

    return res.data;
  } catch (err: any) {
    checkForAuthorization(err);
    return {
      error: true,
      message: err.response.data,
    };
  }
};

export const acceptFriendRequest = async (invitationId: string) => {
  try {
    const res = await api.post("/api/invite-friend/accept", {
      invitationId,
    });

    return res.data;
  } catch (err: any) {
    checkForAuthorization(err);
    return {
      error: true,
      message: err.response.data,
    };
  }
};

export const createGroupChat = async (name: string) => {
  try {
    const res = await api.post("/api/group-chat", {
      name,
    });

    return res.data;
  } catch (err: any) {
    checkForAuthorization(err);
    return {
      error: true,
      message: err.response.data,
    };
  }
};

export const addMembersToGroup = async (data: AddMembersToGroupArgs) => {
  try {
    const res = await api.post("/api/group-chat/add", {
      friendIds: data.friendIds,
      groupChatId: data.groupChatId,
    });

    return res.data;
  } catch (err: any) {
    checkForAuthorization(err);
    return {
      error: true,
      message: err.response.data,
    };
  }
};

export const leaveGroup = async (data: LeaveGroupArgs) => {
  try {
    const res = await api.post("/api/group-chat/leave", {
      groupChatId: data.groupChatId,
    });

    return res.data;
  } catch (err: any) {
    checkForAuthorization(err);
    return {
      error: true,
      message: err.response.data,
    };
  }
};

export const removeFriend = async (data: RemoveFriendArgs) => {
  try {
    const res = await api.post("/api/invite-friend/remove", {
      friendId: data.friendId,
    });

    return res.data;
  } catch (err: any) {
    checkForAuthorization(err);
    return {
      error: true,
      message: err.response.data,
    };
  }
};

export const deleteGroup = async (data: DeleteGroupArgs) => {
  try {
    const res = await api.post("/api/group-chat/delete", {
      groupChatId: data.groupChatId,
    });

    return res.data;
  } catch (err: any) {
    checkForAuthorization(err);
    return {
      error: true,
      message: err.response.data,
    };
  }
};

export const getConfig = async () => {
  try {
    const res = await api.get("/api/config/getConfig");
    console.log("config:", res.data);

    return res.data;
  } catch (err: any) {
    return {
      error: true,
      message: err.response.data,
    };
  }
};
