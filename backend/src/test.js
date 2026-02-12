const ffmpeg = require("fluent-ffmpeg");
const { extractStreamUrl } = require("./services/streamService"); // Adjust path as needed

/**
 * Test script to verify:
 * 1. yt-dlp is installed and working
 * 2. extractStreamUrl function works correctly
 * 3. FFmpeg can capture frames from the extracted stream
 */

async function testStreamExtraction() {
    console.log("=== Testing Stream Extraction & FFmpeg ===\n");

    // Test YouTube URL - use a short, reliable video
    const youtubeUrl = "https://www.youtube.com/watch?v=jNQXAC9IVRw"; // "Me at the zoo" - first YouTube video
    
    try {
        // Step 1: Test yt-dlp extraction
        console.log("Step 1: Testing yt-dlp stream extraction...");
        console.log(`YouTube URL: ${youtubeUrl}`);
        
        const streamUrl = await extractStreamUrl(youtubeUrl);
        
        console.log("✅ Stream URL extracted successfully!");
        console.log(`Stream URL: ${streamUrl.substring(0, 100)}...`); // Show first 100 chars
        console.log("");

        // Step 2: Test FFmpeg frame capture
        console.log("Step 2: Testing FFmpeg frame capture...");
        console.log("Attempting to capture a test frame...\n");

        await captureTestFrame(streamUrl);

        console.log("\n=== All Tests Passed! ===");
        console.log("✅ yt-dlp is working");
        console.log("✅ extractStreamUrl is working");
        console.log("✅ FFmpeg is working");
        console.log("\nYour setup is ready to go!");

    } catch (error) {
        console.error("\n❌ Test Failed!");
        console.error("Error:", error.message);
        console.error("\nTroubleshooting:");
        
        if (error.message.includes("yt-dlp")) {
            console.error("- Make sure yt-dlp is installed: pip install yt-dlp");
            console.error("- Or install via brew: brew install yt-dlp");
        }
        
        if (error.message.includes("FFmpeg") || error.message.includes("ffmpeg")) {
            console.error("- Make sure FFmpeg is installed: sudo apt install ffmpeg");
            console.error("- Or install via brew: brew install ffmpeg");
        }

        if (error.message.includes("timeout")) {
            console.error("- The operation timed out, try a different video or check your internet");
        }

        process.exit(1);
    }
}

/**
 * Capture a single test frame using FFmpeg
 */
function captureTestFrame(streamUrl) {
    return new Promise((resolve, reject) => {
        const outputPath = "test-frame.jpg";

        ffmpeg(streamUrl)
            .frames(1)
            .outputOptions(["-q:v 2"]) // High quality JPEG
            .output(outputPath)
            .on("start", (cmd) => {
                console.log("FFmpeg command:", cmd);
            })
            .on("progress", (progress) => {
                if (progress.percent) {
                    console.log(`Processing: ${progress.percent.toFixed(1)}%`);
                }
            })
            .on("end", () => {
                console.log(`✅ Test frame saved to: ${outputPath}`);
                resolve();
            })
            .on("error", (err) => {
                console.error("FFmpeg error:", err.message);
                reject(new Error(`FFmpeg failed: ${err.message}`));
            })
            .run();
    });
}

// Run the test
console.log("Starting tests...\n");
testStreamExtraction();