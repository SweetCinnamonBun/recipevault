import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link } from "react-router";

const Footer = () => {
  return (
    <div className="w-full h-full py-8 bg-black lg:px-32">
      <div>
        <div className="flex flex-col items-center lg:flex-row md:items-start lg:items-center lg:justify-between md:px-10">
          <Link to="/" className="text-2xl font-bold text-white w-42 h-7">
            RecipeVault
          </Link>

          <ul className="flex flex-col my-10 font-semibold text-center text-white gap-y-5 md:flex-row md:gap-y-0 md:gap-x-10">
            <li>
              <Link to="/" className="transition-colors hover:text-orange-500">
                HOME
              </Link>
            </li>
            <li>
              <Link
                to="/favorites"
                className="transition-colors hover:text-orange-500"
              >
                FAVORITES
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="transition-colors hover:text-orange-500"
              >
                DASHBOARD
              </Link>
            </li>
            <li>
              <Link
                to="/all-recipes"
                className="transition-colors hover:text-orange-500"
              >
                ALL RECIPES
              </Link>
            </li>
          </ul>
        </div>

        <p className="px-5 mt-2 mb-10 text-center text-white md:px-10 md:text-start lg:max-w-xl">
          RecipeVault is your ultimate destination for discovering and sharing
          amazing recipes. Our passionate team of chefs and food enthusiasts is
          dedicated to helping you explore new flavors, master cooking
          techniques, and make every meal memorable. Whether you’re a beginner
          or a seasoned cook, we’re here to inspire your culinary journey and
          bring delicious ideas right to your kitchen.
        </p>

        <div className="flex flex-col items-center px-5 md:items-start md:px-10 gap-y-10 lg:gap-y-0 lg:flex-row lg:justify-between">
          <span className="text-white">
            Copyright 2026. All Rights Reserved
          </span>

          {/* Social Icons */}
          <ul className="flex text-white gap-x-5 lg:-mt-16">
            <li>
              <FaFacebookF className="w-6 h-6 transition-colors cursor-pointer hover:text-orange-500" />
            </li>
            <li>
              <FaTwitter className="w-6 h-6 transition-colors cursor-pointer hover:text-orange-500" />
            </li>
            <li>
              <FaInstagram className="w-6 h-6 transition-colors cursor-pointer hover:text-orange-500" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
