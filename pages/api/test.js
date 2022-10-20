import multer from "multer";
import axios from "axios";
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

// function runMiddleware(req, res, fn) {
// 	return new Promise((resolve, reject) => {
// 		fn(req, res, (result) => {
// 			if (result instanceof Error) {
// 				return reject(result);
// 			}
// 			return resolve(result);
// 		});
// 	});
// }

export default async function handler(req, res) {
	// await runMiddleware(req, res, myUploadMiddleware);

  let imgPublicIds = []

	// for (const file of req.files) {
	// 	try {
	// 		const b64 = Buffer.from(file.buffer).toString("base64");
	// 		let dataURI = "data:" + file.mimetype + ";base64," + b64;

	// 		const response = await cloudinary.uploader.upload(dataURI/* , {
	// 			folder: "dropzone-images",
	// 		} */);

  //     imgPublicIds.push(response.public_id)
	// 	} catch (error) {
	// 		res.status(400).json(error);
	// 		return; 
	// 	}
	// }

  // const assetsArray = imgPublicIds.map(id => ({ "media": id }))
    // console.log(assetsArray)

    const manifest_json={
      "template": "grid",
      "width": 400,
      "height": 400,
      "columns": 2,
      "rows": 2, 
      "spacing": 1,
      "color": "green",
      "assetDefaults": { "kind": "upload", "crop": "fill", "gravity": "auto"},
      "assets": [{ "media": "fuwir8lgk0hfwasjoauu" }, 
      { "media": "p1yq0s0dmmicuz6dksg7" },
      { "media": "ajmnhhebn9o7n8e7epuc" }, 
      { "media": "oa00pp5el7omipo1a4he" }]
  }

  const cloudName = "ddmm5ofs1"
  try {
    const collageResponse = await axios.post(`https://api.cloudinary.com/v1_1/ddmm5ofs1/image/create_collage`, {
      public_id: "collage_grid",
      resource_type: "image",
      upload_preset: "ml_default",
      manifest_json: JSON.stringify(manifest_json),
  })
    // console.log(collageResponse.data)
    res.status(200).json(collageResponse.data); 
  } catch (error) {
    console.log(error.message)
    return res.status(400).json(error);
  }

}
