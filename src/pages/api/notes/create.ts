// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type Data = {
	name: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	if (req.method === 'POST') {
		// Enroll Admin User
		const { data: response } = await axios.post(
			'http://localhost:8801/user/enroll',
			{
				id: 'admin',
				secret: 'adminpw',
			}
		);

		console.log('admin token');
		console.log(response.token);

		if (response.token) {
			const { data } = await axios.post(
				'http://localhost:8801/user/enroll',
				{
					id: req.body.paramedicID,
					secret: req.body.paramedicEmail,
				},
				{
					headers: {
						Authorization: `Bearer ${response.token}`,
					},
				}
			);
			const { paramedicID } = req.body;
			const userToken = data.token;
			if (paramedicID) {
				// console.log(req.body);
				const { ...noteData } = req.body;
				const { data } = await axios.post(
					'http://localhost:8801/invoke/fasthealth-1/fasthealth',
					{
						method: 'FHContract:createParamedicNote',
						args: [JSON.stringify(noteData)],
					},
					{
						headers: {
							Authorization: `Bearer ${userToken}`,
						},
					}
				);
				console.log(data);
				res.status(200).send(data);
			}
		}
	}
}
