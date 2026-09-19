const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const authRoutes = require ('./routes/auth.routes')
const musicRoutes = require ('./routes/music.routes')


const app= express()
const allowedOrigins = (process.env.FRONTEND_URLS || 'http://localhost:5173,http://127.0.0.1:5173')
	.split(',')
	.map((origin) => origin.trim())
	.filter(Boolean);
app.use(cors({
	origin(origin, callback) {
		if (!origin || allowedOrigins.includes(origin)) {
			return callback(null, true);
		}
		return callback(null, false);
	},
	credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api/auth',authRoutes)
app.use('/api/music',musicRoutes)

app.use((err, req, res, next) => {
	if (err instanceof require('multer').MulterError) {
		return res.status(400).json({ message: err.code === 'LIMIT_FILE_SIZE' ? 'Audio file must be 50MB or smaller' : err.message });
	}
	console.error('Unhandled error:', err);
	return res.status(500).json({ message: 'Something went wrong on the server' });
});

module.exports = app;