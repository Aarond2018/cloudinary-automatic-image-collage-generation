import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import styles from "../styles/Home.module.css";

export default function ImageCollage({ collageId }) {
	const [collageUrl, setCollageUrl] = useState("");

	const ref = useRef();

	useEffect(() => {
		async function getCollage() {
			if (collageId) {
				try {
					const response = await axios.get(`/api/getCollage?id=${collageId}`);
					setCollageUrl(response.data);
				} catch (error) {
					if (error.response.data.message === "not found") {
						ref.current = setTimeout(() => getCollage(), 10000);
					}
				}
			}
		}
		getCollage();

		return () => clearTimeout(ref.current);
	}, [collageId]);

	return (
		<section className={styles.collage}>
			{collageUrl ? <img src={collageUrl} alt="" /> : <p>loading......</p>}
		</section>
	);
}
