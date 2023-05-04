import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
) {
    // Get data from your database
    res.status(200).json({ "users": "hi" })
}