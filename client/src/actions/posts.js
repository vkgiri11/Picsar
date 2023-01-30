import {
	FETCH_POST,
	FETCH_ALL,
	FETCH_BY_SEARCH,
	CREATE,
	UPDATE,
	DELETE,
	LIKE,
	COMMENT,
	START_LOADING,
	END_LOADING,
} from "../constants/actionTypes";

import * as api from "../api/index.js";

import { toast } from 'react-toastify';

export const getPost = (id) => async (dispatch) => {
	try {
		dispatch({ type: START_LOADING });

		const { data } = await api.fetchPost(id);

		dispatch({ type: FETCH_POST, payload: data });

		dispatch({ type: END_LOADING });
	} catch (error) {
		console.log(error);
	}
};

export const getPosts = (page) => async (dispatch) => {
	try {
		dispatch({ type: START_LOADING });

		const { data } = await api.fetchPosts(page);

		dispatch({ type: FETCH_ALL, payload: data });
		dispatch({ type: END_LOADING });
	} catch (error) {
		console.log(error);
	}
};

export const getPostsBySearch = (searchQuery) => async (dispatch) => {
	try {
		dispatch({ type: START_LOADING });

		const {
			data: { data },
		} = await api.fetchPostsBySearch(searchQuery);

		dispatch({ type: FETCH_BY_SEARCH, payload: data });
		dispatch({ type: END_LOADING });
	} catch (error) {
		console.log(error);
	}
};

export const createPost = (post, history) => async (dispatch) => {
	try {
		dispatch({ type: START_LOADING });

		const { data } = await api.createPost(post);

		history.push(`/posts/${data._id}`);

		dispatch({ type: CREATE, payload: data });
		dispatch({ type: END_LOADING });

    toast.success("Post Created Successfully !!")
	} catch (error) {
		console.log(error);
    toast.error(error.response.data.message)
	}
};

export const updatePost = (id, post) => async (dispatch) => {
	try {
		const { data } = await api.updatePost(id, post);

		dispatch({ type: UPDATE, payload: data });

    toast.success("Post Modified Successfully !!")
	} catch (error) {
		console.log(error);
    toast.error(error.response.data.message)
	}
};

export const deletePost = (id) => async (dispatch) => {
	try {
		await api.deletePost(id);

		dispatch({ type: DELETE, payload: id });

    toast.success("Post Deleted Successfully !!")
	} catch (error) {
		console.log(error);
    toast.error(error.response.data.message)
	}
};

export const likePost = (id) => async (dispatch) => {
	try {
		const { data } = await api.likePost(id);

		dispatch({ type: LIKE, payload: data });
	} catch (error) {
		console.log(error);
	}
};

export const commentPost = (value, id) => async (dispatch) => {
	try {
		const { data } = await api.comment(value, id);

		dispatch({ type: COMMENT, payload: data });

		return data.comments;
	} catch (error) {
		console.log(error);
	}
};
