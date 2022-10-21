import { useState } from "react";
import axios from "axios";

import styles from "../styles/Home.module.css";

import ImagePreview from "../components/ImagePreview";
import ImageCollage from "../components/ImageCollage";

export default function Home() {
	const [files, setFiles] = useState([]);
	const [collageId, setCollageId] = useState("");
	const [status, setStatus] = useState("");

	const handleChange = (e) => {
		for (const file of e.target.files) {
			setFiles((files) => [...files, file]);
		}
	};

	const handleDelete = (index) => {
		setFiles((files) => files.filter((file, i) => i !== index));
	};

	const handleUpload = async () => {
		setStatus("loading...");
		setCollageId("");
		const formData = new FormData();

		files.forEach((file) => {
			formData.append("file", file);
		});

		try {
			const res = await axios.post("/api/upload", formData);
			console.log(res.data.data);
			setCollageId(res.data.data.public_id);
			setStatus("Done, collage will be visible below in few seconds");
		} catch (error) {
			setStatus("failed, try again");
		}
	};

	return (
		<main className={styles.main}>
			<input type="file" multiple onChange={handleChange} />
			{files.length !== 0 && (
				<ImagePreview files={files} handleDelete={handleDelete} />
			)}
			<button
				onClick={handleUpload}
				disabled={files.length === 0 || status === "loading..."}
			>
				Generate Collage
			</button>
			<p>{status}</p>
			{collageId && <ImageCollage collageId={collageId} />}
		</main>
	);
}
