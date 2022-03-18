import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
	return (
		<nav>
			<Link to="/login">login</Link>
			<Link to="/home">home</Link>
			<Link to="/store">store</Link>
			<Link to="/sd">unknown</Link>
		</nav>
	);
};

export default Navbar;
