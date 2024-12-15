import react from 'react';
import { Navigate, Outlet } from 'react-router-dom';
function PrivateComponent(){
    return <Outlet />;
}
export default PrivateComponent;