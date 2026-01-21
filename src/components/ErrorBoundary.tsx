import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 border border-destructive/50 rounded-xl bg-destructive/10 text-destructive flex flex-col items-center justify-center min-h-[200px]">
                    <AlertTriangle className="w-8 h-8 mb-2" />
                    <h3 className="font-bold">Component Error</h3>
                    <p className="text-sm opacity-80 text-center max-w-xs">{this.state.error?.message || "Something went wrong."}</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
