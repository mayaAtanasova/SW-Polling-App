import { Navigate } from 'react-router-dom';
import { useMySelector } from '../../../hooks/useReduxHooks';

type Props = {
    children: JSX.Element;
};

const ProtectedAdminRoute: React.FC<Props> = ({ children }) => {

    const { isAdmin } = useMySelector(state => state.auth);

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedAdminRoute;