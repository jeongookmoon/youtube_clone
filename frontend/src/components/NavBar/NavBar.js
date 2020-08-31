import React from 'react';
import { Menu } from 'antd';
import './Items/NavBar.css';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../_actions/user_actions';

const NavBar = () => {

  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(state => state.user);

  const logout = () => {
    dispatch(logoutUser()).then(response => {
      if (response.payload.logoutSuccess) {
        history.push('/login');
      } else {
        alert('Logout fail');
      }
    });
  }

  if (user.userData && user.userData.isAuth) {
    return (
      <div className="navbar">
        <div className="logo"><a href="/">Youtube Clone</a></div>
        {/* To highlight menu based on current path */}
        <Menu mode="horizontal" className="menu" defaultSelectedKeys={['/']} selectedKeys={[location.pathname]}>
          <Menu.Item key="/"><Link to="/">Home</Link></Menu.Item>
          <Menu.Item key="/news"><Link to="/news">News</Link></Menu.Item>
          <Menu.Item key="/register" className="menu_right"><a onClick={logout} >Logout</a></Menu.Item>
        </Menu>
      </div>
    );
  }

  return (
    <div className="navbar">
      <div className="logo"><a href="/">Youtube Clone</a></div>
      {/* To highlight menu based on current path */}
      <Menu mode="horizontal" className="menu" defaultSelectedKeys={['/']} selectedKeys={[location.pathname]}>
        <Menu.Item key="/"><Link to="/">Home</Link></Menu.Item>
        <Menu.Item key="/news"><Link to="/news">News</Link></Menu.Item>
        <Menu.Item key="/register" className="menu_right"><Link to="/register">Register</Link></Menu.Item>
        <Menu.Item key="/login" className="menu_right"><Link to="/login">Login</Link></Menu.Item>
      </Menu>
    </div>
  );
}

export default NavBar;
