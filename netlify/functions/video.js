// netlify/functions/video.js
import pkg from 'pg';
const { Client } = pkg;

export async function handler(event) {
    const client = new Client({
        connectionString: process.env.NEON_DB_URL, // Add your Neon URL
        ssl: { rejectUnauthorized: false }
    });
    await client.connect();

    const { videoId, action } = JSON.parse(event.body);

    if(action === "like"){
        await client.query(`UPDATE video_stats SET likes = likes + 1 WHERE video_id = $1`, [videoId]);
    } else if(action === "view"){
        await client.query(`UPDATE video_stats SET views = views + 1 WHERE video_id = $1`, [videoId]);
    }

    const res = await client.query(`SELECT likes, views FROM video_stats WHERE video_id = $1`, [videoId]);
    await client.end();

    return {
        statusCode: 200,
        body: JSON.stringify(res.rows[0])
    };
}