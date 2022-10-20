const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: "ddmm5ofs1",
	api_key: process.env.CLD_API_KEY,
	api_secret: process.env.CLD_API_SECRET,
	secure: true,
});

export default async function handler(req, res) {
	try {
		const response = await cloudinary.api.resource(req.query.id);
		res.status(200).json(response.secure_url);
	} catch (error) {
		res.status(400).json({ message: "not found" });
	}
}
