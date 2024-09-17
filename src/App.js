import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import useAuth from './Utilities/Firebase/useAuth';
import useUserInfo from './Utilities/useUserInfo';
import routes from './Routes/Routes';
import LoadingPage from './Routes/LoadingPage';

function App() {
  const { user, loading } = useAuth();
  const userInformation = useUserInfo(user);

  const router = createBrowserRouter(routes(userInformation));

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <RouterProvider router={router} />
  );
}

export default App;