import { AUTH } from "../constants/actionTypes";
import * as api from "../api/index.js";

import { toast } from 'react-toastify';

export const signin = (formData, history) => async (dispatch) => {
	try {
		const { data } = await api.signIn(formData);

		dispatch({ type: AUTH, data });

		history.push("/");
	} catch (error) {
    console.log(error);
    toast.error(error.response.data.message)
	}
};

export const signup = (formData, history) => async (dispatch) => {
	try {
		const { data } = await api.signUp(formData);

		dispatch({ type: AUTH, data });

		history.push("/");
	} catch (error) {
		console.log(error);
    toast.error(error.response.data.message)
	}
};
