import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const HomeLayout = () => {
  return (
    <div>
      <header>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <h1>Home Layout</h1>
        <Outlet /> {/* Renders nested routes */}
      </main>

      <footer>
        <p>© 2024 My Website</p>
      </footer>
    </div>
  );
};

export default HomeLayout;
