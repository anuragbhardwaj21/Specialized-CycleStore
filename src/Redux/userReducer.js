import {
  SIGNUP_NEW_USER,
  LOGIN_NEW_USER,
  CURRENT_USER,
  IS_AUTHENTICATED,
  LOG_OUT_USER,
  POST_USER_ADDRESS,
  GET_USER_ADDRESS,
  GET_USER_PERSONAL_DETAILS,
  POST_USER_PERSONAL_DETAILS,
} from "./actionTypes";

const initialState = {
  currentUser: JSON.parse(localStorage.getItem("userData")) || {},
  isAuthenticated: localStorage.getItem("token") ? true : false,
  address: JSON.parse(localStorage.getItem("savedAddress")) || null,
  personalDetails:
    JSON.parse(localStorage.getItem("savedPersonalDetails")) || null,
};

const userReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SIGNUP_NEW_USER:
    case LOGIN_NEW_USER:
    case CURRENT_USER:
      return { ...state, currentUser: payload, isAuthenticated: true };

    case LOG_OUT_USER:
      return { ...state, currentUser: {}, isAuthenticated: false };

    case IS_AUTHENTICATED:
      return { ...state, isAuthenticated: payload };
    case POST_USER_ADDRESS:
    case GET_USER_ADDRESS:
      return {
        ...state,
        address: payload,
      };

    case GET_USER_PERSONAL_DETAILS:
    case POST_USER_PERSONAL_DETAILS:
      return {
        ...state,
        personalDetails: payload,
      };
    default:
      return state;
  }
};

export default userReducer;
