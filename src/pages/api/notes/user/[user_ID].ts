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
		const { data } = await axios.post(
			'http://localhost:8801/user/enroll',
			{
				id: 'admin',
				secret: 'adminpw',
			}
			// {
			// 	headers: {
			// 		'Content-Type': 'application/json',
			// 	},
			// }
		);

		const adminToken = data.token;

		console.log('admin token');
		console.log(adminToken);

		if (adminToken) {
			const { data } = await axios.post(
				'http://localhost:8801/user/enroll',
				{ id: req.body.id, secret: req.body.email },
				{
					headers: {
						Authorization: `Bearer ${adminToken}`,
					},
				}
			);
			const { user_ID } = req.query;
			const userToken = data.token;
			if (user_ID) {
				console.log('User Id');
				console.log(user_ID);

				const { data } = await axios.post(
					'http://localhost:8801/query/fasthealth-1/fasthealth',
					{
						method: 'FHContract:QueryNotesByPatient',
						args: [user_ID],
					},
					{
						headers: {
							Authorization: `Bearer ${userToken}`,
						},
					}
				);
				console.log(data.response);
				res.status(200).send(data.response);
			}
		}
	}
}
