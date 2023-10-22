import { Reducer } from "redux";
import { actionTypes, ConfigAction, } from "../actions/types";


export interface ConfigState {
    salt: string,
    p:number,
    g:number,
}

const initState = {
    salt: "",
    p:0,
    g:0,
};

export const configReducer: Reducer<ConfigState, ConfigAction> = (
    state = initState,
    action
) => {
    switch (action.type) {
        case actionTypes.setConfig:
            return {
                ...state,
                salt: action.payload.salt,
                p: action.payload.p,
                g: action.payload.g
            };
        default:
            return state;
    }
};
