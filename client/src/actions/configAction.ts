import { actionTypes } from "./types";

export const setConfig = (salt : string, p : number, g :number) => {
  return {
    type: actionTypes.setConfig,
    payload: {
      salt,
      p,
      g,
    },
  };
};
