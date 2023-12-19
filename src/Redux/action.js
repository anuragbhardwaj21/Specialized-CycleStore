import axios from "axios";
import {
  ADD_TO_WISHLIST,
  DEC_CART_QUANTITY,
  DELETE_CART_PRODUCT,
  GET_CART_FAILURE,
  GET_CART_REQUEST,
  GET_CART_SUCCESS,
  GET_DEBOUNCING_SUCCESS,
  GET_PRODUCT_FAILURE,
  GET_PRODUCT_REQUEST,
  GET_PRODUCT_SUCCESS,
  GET_SINGLE_PRODUCT_SUCCESS,
  GET_WISHLIST_FAILURE,
  GET_WISHLIST_REQUEST,
  GET_WISHLIST_SUCCESS,
  INC_CART_QUANTITY,
  POST_CART_PRODUCT,
  POST_NEW_ADDRESS,
  POST_NEW_CARD,
  SIGNUP_NEW_USER,
  LOGIN_NEW_USER,
  CURRENT_USER,
  IS_AUTHENTICATED,
  LOG_OUT_USER,
  REMOVE_FROM_WISHLIST,
  SET_DEBOUNCING_RESET,
  POST_USER_ADDRESS,
  GET_USER_ADDRESS,
  GET_USER_PERSONAL_DETAILS,
  POST_USER_PERSONAL_DETAILS,
} from "./actionTypes";

// Product page actionObj  ------------------------------------------------------
const getProductsRequestAction = () => {
  return {
    type: GET_PRODUCT_REQUEST,
  };
};
const getProductsSuccessAction = (data, newTotalPages) => {
  return {
    type: GET_PRODUCT_SUCCESS,
    payload: {
      data,
      totalPages: newTotalPages,
    },
  };
};
const getProductsFailureAction = (payload) => {
  return {
    type: GET_PRODUCT_FAILURE,
  };
};
const getSingleProductAction = (payload) => {
  return {
    type: GET_SINGLE_PRODUCT_SUCCESS,
    payload,
  };
};

// Products page dispatch functions
export const getProducts =
  (
    page,
    sorting,
    categoryQuery,
    priceQuery,
    colorQuery,
    discountQuery,
    totalPages
  ) =>
  (dispatch) => {
    dispatch(getProductsRequestAction());
    let url = `https://cyclestore.onrender.com/getallproducts?page=${page}&limit=9`;

    if (sorting) {
      url += `&_sort=price&_order=${sorting}`;
    }
    if (categoryQuery !== "") {
      url += `&${categoryQuery}`;
    }
    if (priceQuery) {
      url += `&${priceQuery}`;
    }
    if (colorQuery) {
      url += `&${colorQuery}`;
    }
    if (discountQuery) {
      url += `&${discountQuery}`;
    }

    axios
      .get(url, { headers: { "Accept-Range": "items", "Range-Unit": "items" } })
      .then((res) => {
        const totalCount = res.headers["x-total-count"];
        const newTotalPages = Math.ceil(totalCount / 9);
        const data = res.data;
        if (newTotalPages < totalPages) {
          dispatch(
            getProducts(
              1,
              sorting,
              categoryQuery,
              priceQuery,
              colorQuery,
              discountQuery,
              newTotalPages
            )
          );
        }
        dispatch(getProductsSuccessAction(data, newTotalPages));
      })
      .catch(() => dispatch(getProductsFailureAction()));
  };

export const getSingleProduct = (id) => (dispatch) => {
  dispatch(getProductsRequestAction());
  axios
    .get(`https://cyclestore.onrender.com/product/${id}`)
    .then((res) => dispatch(getSingleProductAction(res.data)))
    .catch(() => dispatch(getProductsFailureAction()));
};

// -------------------------------------------------------------------------------------- //

// Cart page actionObj  --------------------------------------------------------------------
const getCartDataRequestAction = () => {
  return {
    type: GET_CART_REQUEST,
  };
};
const getCartDataSuccessAction = (payload) => {
  const cartProducts = payload.map((product) => ({
    ...product,
    quantity: 1,
  }));

  return {
    type: GET_CART_SUCCESS,
    payload: cartProducts,
  };
};

const getCartDataFailureAction = () => {
  return {
    type: GET_CART_FAILURE,
  };
};
const postCartDataAction = (payload) => {
  return {
    type: POST_CART_PRODUCT,
    payload,
  };
};
const deleteCartDataAction = (payload) => {
  return {
    type: DELETE_CART_PRODUCT,
    payload,
  };
};
const incrementCartQuantityAction = (payload) => {
  return {
    type: INC_CART_QUANTITY,
    payload,
  };
};
const decrementCartQuantityAction = (payload) => {
  return {
    type: DEC_CART_QUANTITY,
    payload,
  };
};

// Cart page dispatch functions

export const getCartProducts = (dispatch) => {
  dispatch(getCartDataRequestAction());

  const token = localStorage.getItem("token");

  axios
    .get("https://cyclestore.onrender.com/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      dispatch(getCartDataSuccessAction(res.data.cart));
    })
    .catch(() => dispatch(getCartDataFailureAction()));
};

export const postCartProduct = (input) => (dispatch) => {
  const productIds = [input.id];
  const token = localStorage.getItem("token");
  dispatch(getCartDataRequestAction());

  axios
    .post(
      `https://cyclestore.onrender.com/cart/add`,
      { productIds },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => dispatch(postCartDataAction(res.data)))
    .catch((error) => {
      // Handle error if needed
      console.error(error);
      dispatch(getCartDataFailureAction());
    });
};

export const deleteCartProduct = (productIds) => (dispatch) => {
  const token = localStorage.getItem("token");

  axios
    .post(
      "https://cyclestore.onrender.com/cart/remove",
      { productIds },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => {
      dispatch(deleteCartDataAction(productIds));
    })
    .catch((error) => {
      console.error(error);
    });
};

export const incCartQuantity = (id) => (dispatch) => {
  dispatch(incrementCartQuantityAction(id));
};

export const decCartQuantity = (id) => (dispatch) => {
  dispatch(decrementCartQuantityAction(id));
};

// --------------------------------------------------------------------------------------------

// Account page actionObj -----------------------------------------------------------------

export const signupNewUser = (userData) => ({
  type: SIGNUP_NEW_USER,
  payload: userData,
});

export const loginNewUser = (userData) => ({
  type: LOGIN_NEW_USER,
  payload: userData,
});

export const setCurrentUser = (userData) => ({
  type: CURRENT_USER,
  payload: userData,
});

export const setIsAuthenticated = (value) => ({
  type: IS_AUTHENTICATED,
  payload: value,
});

export const logOutUser = () => ({
  type: LOG_OUT_USER,
});

export const authenticateUser = () => (dispatch) => {
  axios
    .get("https://cyclestore.onrender.com/login")
    .then((res) => {
      if (res.data.token) {
        dispatch(setCurrentUser(res.data));
        dispatch(setIsAuthenticated(true));
      } else {
        dispatch(logOutUser());
        dispatch(setIsAuthenticated(false));
      }
    })
    .catch(() => {
      dispatch(logOutUser());
      dispatch(setIsAuthenticated(false));
    });
};

export const signupUser = (name, email, password) => (dispatch) => {
  axios
    .post("https://cyclestore.onrender.com/signup", { name, email, password })
    .then((response) => {
      const { username, userid, token } = response.data;
      const userData = { username, userid, token };

      localStorage.setItem("token", token);
      localStorage.setItem("userData", JSON.stringify(userData));
      dispatch(signupNewUser(userData));
      dispatch(setCurrentUser(userData));
      dispatch(setIsAuthenticated(true));

      dispatch(getUserAddress());
      dispatch(getUserPersonalDetails());
    })
    .catch((error) => {
      console.error("Signup failed:", error);
    });
};

export const loginUser = (email, password) => (dispatch) => {
  axios
    .post("https://cyclestore.onrender.com/login", { email, password })
    .then((response) => {
      const { username, userid, token } = response.data;
      const userData = { username, userid, token };

      localStorage.setItem("token", token);
      localStorage.setItem("userData", JSON.stringify(userData));
      dispatch(loginNewUser(userData));
      dispatch(setCurrentUser(userData));
      dispatch(setIsAuthenticated(true));

      dispatch(getUserAddress());
      dispatch(getUserPersonalDetails());
    })
    .catch((error) => {
      console.error("Login failed:", error);
    });
};
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem("savedAddress");
  localStorage.removeItem("savedPersonalDetails");
  localStorage.removeItem("userData");

  dispatch(logOutUser());
  dispatch(setIsAuthenticated(false));
};

// --------------------------------------------------------------------------------------------

// Wishlist page actionObj --------------------------------------------------------------------

const getWishRequestAction = () => {
  return {
    type: GET_WISHLIST_REQUEST,
  };
};
const getWishSuccessAction = (payload) => {
  return {
    type: GET_WISHLIST_SUCCESS,
    payload,
  };
};
const getWishFailureAction = () => {
  return {
    type: GET_WISHLIST_FAILURE,
  };
};
const addWishAction = (payload) => {
  return {
    type: ADD_TO_WISHLIST,
    payload,
  };
};
const removeWishAction = (payload) => {
  return {
    type: REMOVE_FROM_WISHLIST,
    payload,
  };
};

// wishlist page dispatch function
export const getWishList = (dispatch) => {
  dispatch(getWishRequestAction());

  const token = localStorage.getItem("token");

  axios
    .get("https://cyclestore.onrender.com/wishlist", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => dispatch(getWishSuccessAction(res.data)))
    .catch(() => dispatch(getWishFailureAction()));
};

export const removeWish = (ids) => (dispatch) => {
  dispatch(getWishRequestAction());
  const token = localStorage.getItem("token");

  axios
    .delete(`https://cyclestore.onrender.com/wishlist/remove`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        ids: ids,
      },
    })
    .then((res) => dispatch(removeWishAction(ids)))
    .catch(() => dispatch(getWishFailureAction()));
};

export const addWish = (input) => (dispatch) => {
  const productIds = [input.id];
  const token = localStorage.getItem("token");
  dispatch(getWishRequestAction());

  axios
    .post(
      `https://cyclestore.onrender.com/wishlist/add`,
      { productIds },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => dispatch(addWishAction(res.data)))
    .catch(() => {
      dispatch(getWishFailureAction());
    });
};

// ----------------------------------------------------------------------------

// Debouncing action obj -------------------------------------------------

const debouncingAction = (payload) => {
  return {
    type: GET_DEBOUNCING_SUCCESS,
    payload,
  };
};

const resetDebouncingAction = () => {
  return {
    type: SET_DEBOUNCING_RESET,
  };
};

// Debouncing Function  ------------------------------------------------

export const debouncingFunction = (searchQuery) => (dispatch) => {
  dispatch(resetDebouncingAction());
  axios
    .get(
      `https://specialized-bike-json-server.onrender.com/products?q=${searchQuery}&_page=1&_limit=10`
    )
    .then((res) => dispatch(debouncingAction(res.data)))
    .catch((error) => console.log(error));
};

export const resetDebouncing = (dispatch) => {
  dispatch(resetDebouncingAction());
};

// -----------------------------------------------------------------

// Paymentpage Action object

const postNewAddressAction = (payload) => {
  return {
    type: POST_NEW_ADDRESS,
    payload,
  };
};

const postNewCardAction = (payload) => {
  return {
    type: POST_NEW_CARD,
    payload,
  };
};

export const postNewAddress = (payload) => (dispatch) => {
  dispatch(postNewAddressAction(payload));
};

export const postnewCard = (paylaod) => (dispatch) => {
  dispatch(postNewCardAction(paylaod));
};


export const postUserAddress = (addressData) => (dispatch) => {
  const token = localStorage.getItem("token");
  axios
    .post("https://cyclestore.onrender.com/addaddress", addressData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      dispatch({
        type: POST_USER_ADDRESS,
        payload: res.data,
      });
      dispatch(getUserAddress());
    })
    .catch((error) => {
      console.error("Error posting user address:", error);
    });
};

export const getUserAddress = () => (dispatch) => {
  const token = localStorage.getItem("token");
  axios
    .get("https://cyclestore.onrender.com/getaddress", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      dispatch({
        type: GET_USER_ADDRESS,
        payload: res.data.address,
      });
      localStorage.setItem("savedAddress", JSON.stringify(res.data.address));
    })
    .catch((error) => {
      console.error("Error fetching user address:", error);
    });
};

export const getUserPersonalDetails = () => (dispatch) => {
  const token = localStorage.getItem("token");
  axios
    .get("https://cyclestore.onrender.com/getdetails", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      dispatch({
        type: GET_USER_PERSONAL_DETAILS,
        payload: res.data.personalDetails,
      });
      localStorage.setItem(
        "savedPersonalDetails",
        JSON.stringify(res.data.personalDetails)
      );
    })
    .catch((error) => {
      console.error("Error fetching user personal details:", error);
    });
};

export const postUserPersonalDetails = (personalData) => (dispatch) => {
  const token = localStorage.getItem("token");
  axios
    .post("https://cyclestore.onrender.com/adddetails", personalData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      dispatch({
        type: POST_USER_PERSONAL_DETAILS,
        payload: res.data,
      });
      dispatch(getUserPersonalDetails());
    })
    .catch((error) => {
      console.error("Error posting user personal details:", error);
    });
};
