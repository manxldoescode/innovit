const { Worker } = require("worker_threads");
const path = require("path");
const SurveillanceSession = require("../models/SurveillanceSession");
const { extractStreamUrl } = require("../services/streamService");

const startSurveillance = async (req, res) => {
    try {
        const { youtubeUrl, interval, prompt } = req.body;

        if (!youtubeUrl || !interval || !prompt) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Extract stream URL
        const streamUrl = await extractStreamUrl(youtubeUrl);

        const session = await SurveillanceSession.create({
            user: req.user._id,
            youtubeUrl,
            interval,
            prompt,
            status: "running"
        });

        const worker = new Worker(
            path.resolve(__dirname, "../workers/frameCaptureWorker.js"),
            {
                workerData: {
                    streamUrl: streamUrl,
                    interval : interval,
                    sessionId: session._id.toString(),
                    prompt : prompt,
                    userId: req.user._id.toString(),
                    mongoUri: process.env.MONGO_URI
                }
            }
        );

        worker.on("error", (err) => {
            console.error("Worker error:", err);
        });

        worker.on("exit", (code) => {
            console.log("Worker exited with code:", code);
        });

        res.status(201).json({
            success: true,
            message: "Surveillance Started",
            sessionId: session._id
        });

    } catch (e) {
        console.error(e);

        return res.status(500).json({
            success: false,
            message: "Failed to start Surveillance"
        });
    }
}

module.exports = { startSurveillance };