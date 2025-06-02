import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { UseAccount } from "../Context/AccountContext";

interface protectedRoutesProps {
    children: ReactNode
}

const protectedRoute: React.FC<protectedRoutesProps> = ({ children }) => {
    const { user } = UseAccount();
    
    if (!user) {
        
        console.log("ingen user");
        
        return <Navigate to="/login" replace />
    }

    return (<>{children}</>)
}

export default protectedRoute;

