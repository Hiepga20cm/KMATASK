import { Reducer } from "redux";
import { actionTypes, KeyLoginAction, } from "../actions/types";


export interface KeyLoginState {
    keyQr: string,
    
}

const initState = {
    keyQr: "",
   
};

export const keyLoginReducer: Reducer<KeyLoginState, KeyLoginAction> = (
    state = initState,
    action
) => {
    switch (action.type) {
        case actionTypes.setKeyLogin:
            return {
                ...state,
                keyQr: action.payload.keyQr,
            };
        default:
            return state;
    }
};
