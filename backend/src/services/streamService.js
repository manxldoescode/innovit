const { execFile } = require('child_process');

const extractStreamUrl = (youtubeUrl) => {
    return new Promise((resolve, reject) => {
        // Use execFile instead of exec to prevent command injection
        execFile('yt-dlp', ['-g', youtubeUrl], { timeout: 30000 }, (error, stdout, stderr) => {
            if (error) {
                return reject(new Error(`Failed to extract stream URL: ${error.message}`));
            }

            const urls = stdout.split("\n").filter(Boolean);

            if (!urls.length) {
                return reject(new Error("No stream URL found"));
            }

            resolve(urls[0].trim());
        });
    });
}

module.exports = { extractStreamUrl };