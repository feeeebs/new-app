import Homepage from './Homepage';
import ErrorPage from './ErrorPage';
import LoadingPage from './LoadingPage';
import Dashboard from './Dashboard';
import Profile from './Profile';
import AddNewLyrics from './AddNewLyrics';
import NewLyricSearch from './NewLyricSearch';
import EditFavoriteLyric from './EditFavoriteLyric';
import Login from './Login';
import Signup from './Signup';
import ResetPassword from './ResetPassword';
import PrivateRoute from '../Components/PrivateRoute';

const routes = (userInformation) => [
  {
    path: "/",
    element: <Homepage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/loading",
    element: <LoadingPage userInfo={userInformation} />,
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><Dashboard userInfo={userInformation} /></PrivateRoute>,
  },
  {
    path: "/profile",
    element: <PrivateRoute><Profile userInfo={userInformation} /></PrivateRoute>,
  },
  {
    path: "/add-lyrics/:lyricId",
    element: <PrivateRoute><AddNewLyrics userInfo={userInformation} /></PrivateRoute>,
  },
  {
    path: "/lyric-search",
    element: <PrivateRoute><NewLyricSearch userInfo={userInformation} /></PrivateRoute>,
  },
  {
    path: "/edit-favorite/:favoriteId",
    element: <PrivateRoute><EditFavoriteLyric userInfo={userInformation} /></PrivateRoute>,
  },
];

export default routes;