import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import logo from '../assets/logo.png'; // Adjust path to your logo

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
    }
  }, []);

  return (
    <header className="bg-green-500 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        
        <Link to="/">
          <div className="flex items-center">
            <img src={logo} alt="Company Logo" className="w-12 h-12 rounded-full mr-2" />
            <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
              <span className="text-green-50">Mirpurkhas</span>
              <span className="text-green-900">Estate</span>
            </h1>
          </div>
        </Link>

        <form onSubmit={handleSubmit} className="bg-green-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch className="text-green-900" />
          </button>
        </form>

        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-green-900 hover:underline">Home</li>
          </Link>

          <Link to="/about">
            <li className="hidden sm:inline text-green-900 hover:underline">About</li>
          </Link>

          {currentUser ? (
            <Link to="/profile"> {/* Link added for profile */}
              <img
                src={currentUser.avatar || ''} /* Fixed typo: avatar, not avator */
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover" /* Added CSS class for styling */
              />
            </Link>
          ) : (
            <Link to="/sign-in"> {/* Corrected link for Sign In */}
              <li className="text-green-900 hover:underline">Sign in</li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}
