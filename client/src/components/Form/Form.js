import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { TextField, Button, Typography, Paper } from "@material-ui/core";
import ChipInput from "material-ui-chip-input";
import FileBase from "react-file-base64";

import { createPost, updatePost } from "../../actions/posts";
import useStyles from "./styles";

const Form = ({ currentId, setCurrentId }) => {
	const [postData, setPostData] = useState({
		title: "",
		message: "",
		tags: [],
		selectedFile: "",
	});

	const post = useSelector((state) => (currentId ? state.posts.posts.find((p) => p._id === currentId) : null));

	const dispatch = useDispatch();
	const history = useHistory();
	const classes = useStyles();
	const user = JSON.parse(localStorage.getItem("profile"));

	useEffect(() => {
		if (!post?.title) clear();

		if (post) setPostData(post);
     // eslint-disable-next-line
	}, [post]);

	const handleSubmit = (event) => {
		event.preventDefault();

		if (currentId) {
			dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }));
		} else {
			dispatch(createPost({ ...postData, name: user?.result?.name }, history));
		}

		clear();
	};

	const clear = () => {
		setCurrentId(null);
		setPostData({
			title: "",
			message: "",
			tags: [],
			selectedFile: "",
		});
	};

	const handleAddChip = (tag) => {
		setPostData({ ...postData, tags: [...postData.tags, tag.toLowerCase().replaceAll(" ", "")] });
	};

	const handleDeleteChip = (chipToDelete) => {
		setPostData({ ...postData, tags: postData.tags.filter((tag) => tag !== chipToDelete) });
	};

	if (!user?.result?.name) {
		return (
			<Paper className={classes.paper} elevation={6}>
				<Typography variant="h6" align="center">
					Please Sign in to upload your own pics and interact with other posts!!
				</Typography>
			</Paper>
		);
	}

	return (
		<Paper className={classes.paper} elevation={6}>
			<form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
				<Typography variant="h6">{currentId ? "Editing" : "Creating"} a Memory</Typography>
				<TextField
					name="title"
					variant="outlined"
					label="Title"
					fullWidth
					value={postData.title}
					onChange={(event) => setPostData({ ...postData, title: event.target.value })}
				/>
				<TextField
					name="message"
					variant="outlined"
					label="Message"
					fullWidth
					multiline
					rows={4}
					value={postData.message}
					onChange={(event) => setPostData({ ...postData, message: event.target.value })}
				/>
				<div style={{ padding: "5px 0", width: "94%" }}>
					<ChipInput
						name="tags"
						variant="outlined"
						label="Tags"
						fullWidth
						value={postData.tags}
						onAdd={(chip) => handleAddChip(chip)}
						onDelete={(chip) => handleDeleteChip(chip)}
					/>
				</div>
				<div className={classes.fileInput}>
					<FileBase
						type="file"
						multiple={false}
						onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })}
					/>
				</div>
				<Button
					className={classes.buttonSubmit}
					variant="contained"
					color="primary"
					size="large"
					type="submit"
					fullWidth
				>
					Submit
				</Button>
				<Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>
					Clear
				</Button>
			</form>
		</Paper>
	);
};

export default Form;
