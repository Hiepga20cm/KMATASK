import { actionTypes } from "./types";

export const setConfig = (salt = "", p = 0, g = 0) => {
  return {
    type: actionTypes.setConfig,
    payload: {
      salt,
      p,
      g,
    },
  };
};
