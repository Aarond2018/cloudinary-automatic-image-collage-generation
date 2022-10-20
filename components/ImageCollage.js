import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

import axios from "axios";

export default function ImageCollage({ collageId }) {
	const [collageUrl, setCollageUrl] = useState("");

	useEffect(() => {
		let timer;
		async function getCollage() {
			if(timer) clearTimeout(timer);
			if (collageId) {
				try {
					const response = await axios.get(`/api/getCollage?id=${collageId}`);
					console.log({ r: response });
					setCollageUrl(response.data);
				} catch (error) {
            console.log({ttt: error})
					if (error.response.data.message === "not found") {
						timer = setTimeout(() => getCollage(), 10000);
					}
				}
			}
		};

		getCollage()

		return () => {
			console.log("kkkk")
			console.log(timer)
			clearTimeout(timer);
		}
	}, [collageId]);

	return (
		<section className={styles.collage}>
			{collageUrl ? <img src={collageUrl} alt="" /> : "loading......"}
		</section>
	);
}
