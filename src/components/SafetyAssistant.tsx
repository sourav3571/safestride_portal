import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createChatSession } from "@/lib/gemini";

interface Message {
    role: "user" | "assistant";
    text: string;
}

const SafetyAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            text: "👋 Hi! I'm your Safety Assistant, powered by Google Gemini AI. I can help with safety tips, emergency procedures, and travel advice. How can I help you stay safe today?"
        }
    ]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const chatSessionRef = useRef<any>(null);

    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim() || isLoading) return;

        if (!API_KEY) {
            setMessages(prev => [...prev, {
                role: "assistant",
                text: "⚠️ Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file."
            }]);
            return;
        }

        const userMessage = inputText.trim();
        setInputText("");
        setMessages(prev => [...prev, { role: "user", text: userMessage }]);
        setIsLoading(true);

        try {
            if (!chatSessionRef.current) {
                chatSessionRef.current = createChatSession();
            }

            const result = await chatSessionRef.current.sendMessage(userMessage);
            const aiResponse = result.response.text();

            setMessages(prev => [...prev, { role: "assistant", text: aiResponse }]);
        } catch (error: any) {
            console.error("Gemini Error:", error);
            setMessages(prev => [...prev, {
                role: "assistant",
                text: `❌ Error: ${error.message}. Please check your API key and try again.`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-24 w-16 h-16 rounded-full gradient-bg shadow-glow flex items-center justify-center z-50 hover:scale-110 transition-transform"
                    >
                        <MessageCircle className="w-7 h-7 text-primary-foreground" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-6 right-24 w-96 h-[600px] bg-card border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="gradient-bg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-primary-foreground" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-primary-foreground">Safety Assistant</h3>
                                    <p className="text-xs text-primary-foreground/80">Powered by Gemini AI</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5 text-primary-foreground" />
                            </button>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                            <div className="space-y-4">
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        {msg.role === "assistant" && (
                                            <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                                                <Bot className="w-5 h-5 text-primary-foreground" />
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[75%] rounded-2xl px-4 py-2 ${msg.role === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-foreground"
                                                }`}
                                        >
                                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                        {msg.role === "user" && (
                                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                                <User className="w-5 h-5 text-primary-foreground" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-3 justify-start">
                                        <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                                            <Bot className="w-5 h-5 text-primary-foreground" />
                                        </div>
                                        <div className="bg-muted rounded-2xl px-4 py-2">
                                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Input */}
                        <div className="p-4 border-t bg-background">
                            <div className="flex gap-2">
                                <Input
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask about safety..."
                                    disabled={isLoading}
                                    className="flex-1"
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={isLoading || !inputText.trim()}
                                    size="icon"
                                    className="gradient-bg shadow-glow"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SafetyAssistant;
