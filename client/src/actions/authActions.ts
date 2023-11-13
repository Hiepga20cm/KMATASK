import { Dispatch,  } from "redux";
import { register, getMe } from "../api/api";
import { RegisterArgs } from "../api/types";
import { showAlert } from "./alertActions";
import { resetChatAction } from "./chatActions";
import { resetFriendsAction } from "./friendActions";
import {actionTypes, CurrentUser} from "./types";

export const loginByQrCode = (data : any ) => {
    
        if(data){
            // console.log(data);
            return async (dispatch : Dispatch) => {
                localStorage.setItem("currentUser", JSON.stringify(data));
                dispatch({
                    type: actionTypes.authenticate,
                    payload: data            
                })
                dispatch(
                    showAlert(
                     //    `Hi, ${response.userDetails.username} 👋. Welcome back.`
                     "hi"
                    )
                );

            }
        }else {
        return "error"
    }
   
}

// export const loginUser = (credentials: LoginArgs) => {
//     return async (dispatch: Dispatch) => {
//         const response = await login(credentials);

//         if ("error" in response) {
//             dispatch({
//                 type: actionTypes.authError,
//                 payload: response.message
//             })
//             dispatch(showAlert(response.message));
//         } else {
//             localStorage.setItem("currentUser", JSON.stringify(response.userDetails));
//             dispatch({
//                 type: actionTypes.authenticate,
//                 payload: response.userDetails
//             })

//            dispatch(
//                showAlert(
//                 //    `Hi, ${response.userDetails.username} 👋. Welcome back.`
//                 "hi"
//                )
//            );
//         }
//     }
// } 



export const registerUser = (credentials: RegisterArgs) => {
    return async (dispatch: Dispatch) => {
        const response : any = await register(credentials);
        if (response.status !== 200) {
            dispatch({
                type: actionTypes.authError,
                payload: response.message,
            });
            dispatch(showAlert(response.message));
        } else {
            dispatch(
                showAlert(
                     `Hi 👋. Welcome to KMA. I'm Hiep, the creator of KMA. Please, login by mobile App to active your account 😊.`
                )
            );
        }
    };
}; 


export const autoLogin = () => {
    return async (dispatch: Dispatch) => {

        dispatch({
            type: actionTypes.authLoading,
            payload: true,
        });

        const currentUser: CurrentUser = JSON.parse(
            localStorage.getItem("currentUser") || "{}"
        );

        const response = await getMe();

        // token has expired
        if (response.statusCode === 401 || response.statusCode === 403) {
            localStorage.clear();
            dispatch({
                type: actionTypes.authLoading,
                payload: false,
            });

        } else {

            if (currentUser.token) {
                dispatch({
                    type: actionTypes.authenticate,
                    payload: {
                        ...response.me,
                        token: currentUser.token,
                        privateKey : currentUser.privateKey,
                    },
                });
            }

        }

    }
}


export const logoutUser = () => {
    return async (dispatch: Dispatch) => {
        localStorage.removeItem("currentUser");
        dispatch({
            type: actionTypes.logout,
        });

        dispatch(resetChatAction());
        dispatch(resetFriendsAction());

        dispatch({
            type: actionTypes.resetChat
        })
    }
}
export const setSocketId = (socketId : any) => {
    return async (dispatch: Dispatch) => {
        dispatch({
            type: actionTypes.socketId,
            payload : socketId
        });
    }
}
export const setKeyLogin = (keyQr : string ) => {
    console.log(keyQr);
    
    return async (dispatch: Dispatch) => {
        dispatch({
            type : actionTypes.setKeyLogin,
            payload : {keyQr}
        })
    }
}