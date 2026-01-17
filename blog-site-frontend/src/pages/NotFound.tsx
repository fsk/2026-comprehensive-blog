import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                404
            </h1>
            <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">
                Page Not Found
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 max-w-md">
                Sorry, the page you are looking for doesn't exist or has been moved.
            </p>

            <button
                onClick={() => navigate("/")}
                className="mt-8 flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
                <Home className="w-5 h-5" />
                <span>Go Home</span>
            </button>
        </div>
    );
}
