const { openai } = require('../config/openai');

async function assessAnomaly(base64Image, userPrompt) {
    // Input validation
    if (!base64Image || !userPrompt) {
        throw new Error("base64Image and userPrompt are required");
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `
                                You are supposed to detect the anomaly the instructions : 
                                User Instructions:
                                ${userPrompt}

                                Carefully analyze the provided frame.

                                Respond STRICTLY in JSON format:

                                {
                                "anomalyDetected": true or false,
                                "description": "Short explanation of what is happening in the image",
                                "severity": "low | medium | high"
                                }
                            `
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`
                            }
                        }
                    ]
                }
            ],
            response_format: { type: "json_object" }
            // Remove timeout - OpenAI doesn't support it!
        });

        let parsed;
        try {
            parsed = JSON.parse(response.choices[0].message.content);

            // Validate the response structure
            if (!parsed.hasOwnProperty('anomalyDetected') || 
                !parsed.hasOwnProperty('description') || 
                !parsed.hasOwnProperty('severity')) {
                console.warn("AI returned incomplete response:", parsed);
                parsed = {
                    anomalyDetected: false,
                    description: "AI response missing required fields",
                    severity: "low"
                };
            }

        } catch (e) {
            console.error("AI parsing failed:", e);
            parsed = {
                anomalyDetected: false,
                description: "AI response parsing failed",
                severity: "low"
            };
        }

        return parsed;
        
    } catch (e) {
        console.error("AI request failed:", e.response?.data || e.message);
        return {
            anomalyDetected: false,
            description: "AI request failed",
            severity: "low"
        };
    }
}

module.exports = { assessAnomaly };