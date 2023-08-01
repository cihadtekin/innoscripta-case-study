import { Outlet, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { User, UserState } from "./types/User";
import { logout } from "./store";
import { useState } from "react";

export default function Layout() {
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector<{ user: UserState }>((state) => state.user.user) as User|null;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setShowMenu(false);
  }
  return (
    <>
      <div className="container">
        <nav className="navbar navbar-expand-lg bg-body-tertiary my-4">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">NewsFeed</a>

            <button className="navbar-toggler" type="button" onClick={() => setShowMenu(!showMenu)}>
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className={"collapse navbar-collapse text-right" + (showMenu ? " show" : "")}>
              <ul className="navbar-nav ms-auto flex-nowrap">
                <li className="nav-item">
                  <Link className="nav-link" to="/" onClick={() => setShowMenu(false)}>Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/discover" onClick={() => setShowMenu(false)}>Discover</Link>
                </li>
                {!user &&
                  <li className="nav-item">
                    <Link className="nav-link" to="/register" onClick={() => setShowMenu(false)}>Register</Link>
                  </li>
                }
                {user &&
                  <li className="nav-item">
                    <a className="nav-link" onClick={() => handleLogout()}>Logout</a>
                  </li>
                }
                {!user &&
                  <li className="nav-item">
                    <Link className="nav-link" to="/login" onClick={() => setShowMenu(false)}>Login</Link>
                  </li>
                }
              </ul>
            </div>
          </div>
        </nav>

        <Outlet />
      </div>
    </>
  )
}