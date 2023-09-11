import { Reducer } from "redux";
import { AuthActions, actionTypes } from "../actions/types";

interface AuthState {
    userDetails: {
        _id: string;
        email: string;
        token: string;
        username: string;
        active: boolean;
    } | null;
    socketId : string;
    error: boolean;
    errorMessage: string;
    loading: boolean;
}

const initialState: AuthState = {
    userDetails: null,
    socketId : "",
    error: false,
    errorMessage: "",
    loading: false,
};

const authReducer: Reducer<AuthState, AuthActions> = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case actionTypes.authenticate:
            return {
                error: false,
                errorMessage: "",
                userDetails: action.payload,
                socketId : "",
                loading: false,
            };

        case actionTypes.authError:
            return {
                ...state,
                error: true,
                errorMessage: action.payload,
                socketId : "",
                loading: false,
            };

        case actionTypes.logout:
            return {
                error: false,
                errorMessage: "",
                userDetails: null,
                socketId : "",
                loading: false,
            };
        case actionTypes.authLoading:
            return {
                error: false,
                errorMessage: "",
                userDetails: null,
                socketId : "",
                loading: action.payload,
            };
        case actionTypes.socketId:
            return {
                error: false,
                errorMessage: "",
                userDetails: null,
                socketId : action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

export { authReducer };
