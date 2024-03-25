import React from "react";
import { Dropdown, Navbar } from "flowbite-react";
import { Link } from "gatsby";

function AppNavbar() {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand as={Link} href="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Unsplash Demo
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <div className="relative size-10 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600">
              <svg
                className="absolute -left-1 size-12 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                ></path>
              </svg>
            </div>
          }
        >
          <Dropdown.Header>
            <span className="block text-sm text-gray-400">User Menu</span>
          </Dropdown.Header>
          <Dropdown.Item>
            <Link to="/favourites">Favourites</Link>
          </Dropdown.Item>
        </Dropdown>
      </div>
    </Navbar>
  );
}

export default AppNavbar;
