import { AuthProvider } from "../context/AuthContext";
import { StudentPortalProvider } from "../context/StudentPortalContext";

export default function Providers({ children }) {
    return (
        <AuthProvider>
            <StudentPortalProvider>
                {children}
            </StudentPortalProvider>
        </AuthProvider>
    );
}
