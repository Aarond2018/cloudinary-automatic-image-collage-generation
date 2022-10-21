import styles from "../styles/Home.module.css";

export default function ImagePreview({ files, handleDelete }) {
	return (
		<section className={styles.preview}>
			{files.map((file, index) => (
				<div key={index}>
					<img src={`${URL.createObjectURL(file)}`} alt="" />
					<p onClick={() => handleDelete(index)}>x</p>
				</div>
			))}
		</section>
	);
}
