import multer from "multer";
import axios from "axios";
// import Cors from 'cors'
const cloudinary = require("cloudinary").v2;

const storage = multer.memoryStorage();
const upload = multer({ storage });
const myUploadMiddleware = upload.array("file");

cloudinary.config({
	cloud_name: "ddmm5ofs1",
	api_key: process.env.CLD_API_KEY,
	api_secret: process.env.CLD_API_SECRET,
	secure: true,
});

// const cors = Cors({
//   methods: ['GET', 'HEAD', 'POST'],
// })

function runMiddleware(req, res, fn) {
	return new Promise((resolve, reject) => {
		fn(req, res, (result) => {
			if (result instanceof Error) {
				return reject(result);
			}
			return resolve(result);
		});
	});
}

export default async function handler(req, res) {
	// await runMiddleware(req, res, cors)
	await runMiddleware(req, res, myUploadMiddleware);
	let imgPublicIds = [];

	for (const file of req.files) {
		try {
			const b64 = Buffer.from(file.buffer).toString("base64");
			let dataURI = "data:" + file.mimetype + ";base64," + b64;

			const response = await cloudinary.uploader.upload(dataURI);

			imgPublicIds.push(response.public_id);
		} catch (error) {
			res.status(400).json(error);
			console.log({ errrrr: error });
			return;
		}
	}

	const assetsArray = imgPublicIds.map((id) => ({ media: id }));
	console.log(assetsArray);

	const manifest_json = {
		template: "grid",
		width: 400,
		height: 400,
		columns: 2,
		rows: 2,
		spacing: 1,
		color: "green",
		assetDefaults: { kind: "upload", crop: "fill", gravity: "auto" },
		assets: assetsArray,
	};

	const cloudName = process.env.CLD_CLOUD_NAME;
	try {
		const collageResponse = await axios.post(
			`https://api.cloudinary.com/v1_1/${cloudName}/image/create_collage`,
			{
				public_id: `${Date.now()}`,
				resource_type: "image",
				upload_preset: "ml_default",
				manifest_json: JSON.stringify(manifest_json),
			}
		);
		res.status(200).json({ data: collageResponse.data });
	} catch (error) {
		console.log(error);
		return res.status(400).json(error);
	}
}

export const config = {
	api: {
		bodyParser: false,
	},
};
