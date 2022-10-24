import axios from "axios";
// import Cors from 'cors'
const cloudinary = require("cloudinary").v2;

const { myUploadMiddleware, runMiddleware } = require("../../helpers/helpers");

cloudinary.config({
	cloud_name: process.env.CLD_CLOUD_NAME,
	api_key: process.env.CLD_API_KEY,
	api_secret: process.env.CLD_API_SECRET,
	secure: true,
});

// const cors = Cors({
//   methods: ['GET', 'HEAD', 'POST'],
// })

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
			return res.status(400).json(error);
		}
	}

	const assetsArray = imgPublicIds.map((id) => ({ media: id }));

	const manifest_json = {
		template: [
			[1, 1, 2],
			[1, 1, 3],
			[1, 1, 4]
		],
		width: 400,
		height: 320,
		columns: 3,
		rows: 3,
		spacing: 5,
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
				upload_preset: process.env.CLD_UPLOAD_PRESET,
				manifest_json: JSON.stringify(manifest_json),
			}
		);
		res.status(200).json({ data: collageResponse.data });
	} catch (error) {
		return res.status(400).json(error);
	}
}

export const config = {
	api: {
		bodyParser: false,
	},
};
