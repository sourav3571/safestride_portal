import { useState, useRef, useEffect } from "react";
import Groq from "groq-sdk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    role: "user" | "model";
    text: string;
}

const SafetyAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "model", text: "Hi! I'm your Safety Assistant powered by Llama. I can help with safety tips, emergency procedures, or travel advice. How can I help you today?" }
    ]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Groq API Key (free tier)
    const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        if (!API_KEY) {
            setMessages(prev => [...prev, { role: "user", text: inputText }, { role: "model", text: "Error: VITE_GROQ_API_KEY is missing in .env file. Get your free key at https://console.groq.com" }]);
            setInputText("");
            return;
        }

        const userMessage = inputText;
        setInputText("");
        setMessages(prev => [...prev, { role: "user", text: userMessage }]);
        setIsLoading(true);

        try {
            const groq = new Groq({
                apiKey: API_KEY,
                dangerouslyAllowBrowser: true
            });

            // Build conversation history for context
            const chatHistory = messages.slice(1).map(m => ({
                role: m.role === "user" ? "user" as const : "assistant" as const,
                content: m.text
            }));

            const completion = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful Safety Assistant. You help with personal safety, travel safety, emergency procedures, and first aid. Keep responses concise and helpful."
                    },
                    ...chatHistory,
                    { role: "user", content: userMessage }
                ],
                max_tokens: 500,
            });

            const responseText = completion.choices[0]?.message?.content || "No response received";
            setMessages(prev => [...prev, { role: "model", text: responseText }]);
        } catch (error: any) {
            console.error("Groq Error:", error);
            const errorMessage = error?.message || "Unknown error occurred";
            setMessages(prev => [...prev, { role: "model", text: `I encountered an error: ${errorMessage}. Please try again.` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Added z-[9999] to ensure it sits on top of everything
        <div className="fixed bottom-24 right-6 z-[9999]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-80 sm:w-96 bg-card border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                        style={{ maxHeight: "calc(100vh - 150px)", height: "500px" }}
                    >
                        {/* Header */}
                        <div className="p-4 bg-primary text-primary-foreground flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Bot className="w-5 h-5" />
                                <h3 className="font-semibold">Safety Assistant</h3>
                            </div>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-primary-foreground hover:bg-primary/80" onClick={() => setIsOpen(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Chat Area */}
                        <ScrollArea className="flex-1 p-4 bg-muted/30">
                            <div className="flex flex-col gap-4">
                                {messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`flex items-start gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted border"}`}>
                                            {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                        </div>
                                        <div
                                            className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.role === "user"
                                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                                : "bg-card border rounded-tl-none shadow-sm"
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {Boolean(isLoading) && (
                                    <div className="flex items-start gap-2">
                                        <div className="w-8 h-8 rounded-full bg-muted border flex items-center justify-center shrink-0">
                                            <Bot className="w-4 h-4" />
                                        </div>
                                        <div className="bg-card border rounded-2xl rounded-tl-none px-4 py-2 shadow-sm">
                                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                        </div>
                                    </div>
                                )}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="p-4 border-t bg-card">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSend();
                                }}
                                className="flex gap-2"
                            >
                                <Input
                                    placeholder="Ask about safety..."
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    disabled={isLoading}
                                    className="rounded-full"
                                />
                                <Button type="submit" size="icon" disabled={isLoading || !inputText.trim()} className="rounded-full shrink-0">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="lg"
                className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all p-0"
            >
                <MessageCircle className="w-7 h-7" />
            </Button>
        </div>
    );
};

export default SafetyAssistant;