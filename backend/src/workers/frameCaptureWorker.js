const { workerData } = require("worker_threads");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { assessAnomaly } = require("../services/aiService");
const SurveillanceLog = require("../models/SurveillanceLog");

const { streamUrl, interval, sessionId, prompt, userId, } = workerData;

console.log("Worker started for session:", sessionId);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(()=>console.log("mongodb is successfully connected for worker"))
.catch(e=>console.error("An Error has occured : ",e))


// Create output directory
const outputDir = path.join(__dirname, "../uploads/frames", sessionId);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

let frameCount = 0;
let isCapturing = false;

async function captureFrame() {
    if (isCapturing) return; // Skip if already capturing
    
    isCapturing = true;
    const outputPath = path.join(outputDir, `frame_${Date.now()}.jpg`);

    ffmpeg(streamUrl)
        .frames(1)
        .outputOptions(["-q:v 2"])
        .output(outputPath)
        .on("end", async () => {
            frameCount++;
            console.log(`Frame ${frameCount} saved`);

            try {
                // Read image
                const imageBuffer = fs.readFileSync(outputPath);
                const base64Image = imageBuffer.toString("base64");

                console.log(base64Image);
                console.log(prompt);
                
                

                // Analyze with AI
                const result = await assessAnomaly(base64Image, prompt);
                console.log("AI Result:", result);

                // Save to database
                await SurveillanceLog.create({
                    session: sessionId,
                    user: userId,
                    imagePath: outputPath,
                    aiResponse: JSON.stringify(result),
                    snippet: result.description
                });

                if (result.anomalyDetected) {
                    console.log(`⚠️  ANOMALY (${result.severity}): ${result.description}`);
                }

            } catch (err) {
                console.error("Processing error:", err.message);
            }

            isCapturing = false;
        })
        .on("error", (err) => {
            console.error("FFmpeg error:", err.message);
            isCapturing = false;
        })
        .run();
}

// Start capturing
captureFrame();
setInterval(captureFrame, interval * 1000);