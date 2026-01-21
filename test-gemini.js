import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

async function test() {
    try {
        const envFile = fs.readFileSync(".env", "utf-8");
        const keyLine = envFile.split("\n").find(line => line.startsWith("VITE_GEMINI_API_KEY="));
        if (!keyLine) {
            console.error("No VITE_GEMINI_API_KEY found in .env");
            process.exit(1);
        }
        const apiKey = keyLine.split("=")[1].trim();
        console.log("Using API Key:", apiKey.substring(0, 10) + "..." + apiKey.substring(apiKey.length - 4));

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        console.log("Testing gemini-pro...");
        const result = await model.generateContent("Test message");
        console.log("Success! Response:", result.response.text());
    } catch (error) {
        console.error("Test Failed!");
        console.error("Error Message:", error.message);
    }
}

test();
