import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSun, FaMoon } from 'react-icons/fa';

function UserCard() {
    const [userData, setUserData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState('');
    const [visibleCards, setVisibleCards] = useState(9);
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });

    useEffect(() => {
        axios.get('https://randomuser.me/api/?results=18')
            .then(response => {
                setUserData(response.data.results);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, []);

    useEffect(() => {
        document.documentElement.style.backgroundColor = darkMode ? '#111827' : '#f3f4f6';
        document.documentElement.classList.toggle('dark', darkMode);
        document.body.className = darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black';
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = (e) => {
        setSortKey(e.target.value);
    };

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    const filteredUsers = userData.filter(user =>
        user.name.first.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.last.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
    );

    const sortedUsers = filteredUsers.sort((a, b) => {
        if (!sortKey) return 0;
        if (sortKey === 'firstName') {
            return a.name.first.localeCompare(b.name.first);
        } else if (sortKey === 'lastName') {
            return a.name.last.localeCompare(b.name.last);
        } else if (sortKey === 'gender') {
            return a.gender.localeCompare(b.gender);
        } else if (sortKey === 'phone') {
            return a.phone.localeCompare(b.phone);
        }
        return 0;
    });

    const loadMore = () => {
        setLoading(true);
        setTimeout(() => {
            setVisibleCards((prev) => prev + 3);
            setLoading(false);
        }, 1000);
    };

    return (
        <div className={`w-full min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
            <div className={`p-10 w-full min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
                <div className="flex justify-between items-center mb-6">
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className={`p-2 border rounded-md w-1/3 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                    />
                    <div className="flex items-center gap-4">
                        <select onChange={handleSort} className={`p-2 border rounded-md w-1/2 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                            <option value="">Sort by</option>
                            <option value="firstName">First Name</option>
                            <option value="lastName">Last Name</option>
                            <option value="gender">Gender</option>
                            <option value="phone">Phone Number</option>
                        </select>
                        <button onClick={toggleTheme} className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}>
                            {darkMode ? <FaSun /> : <FaMoon />}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {sortedUsers.slice(0, visibleCards).map((user, index) => (
                        <div
                            key={index}
                            className={`w-full ${darkMode ? 'bg-gray-800 shadow-md' : 'bg-white shadow-lg'} rounded-lg overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-2xl`}>
                            <div className="flex p-6 gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-32 h-32 rounded-lg bg-gray-200 overflow-hidden">
                                        <img
                                            src={user.picture.large}
                                            alt="Profile"
                                            className="w-full h-full object-cover transition duration-300"
                                        />
                                    </div>
                                </div>
                                <div className="flex-grow space-y-4">
                                    <h3 className="text-2xl font-semibold">
                                        {user.name.first} {user.name.last}
                                    </h3>
                                    <p className="text-sm">Gender</p>
                                    <p className="text-base capitalize">{user.gender}</p>
                                    <p className="text-sm">Phone Number</p>
                                    <p className="text-base">{user.phone}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {visibleCards < sortedUsers.length && (
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={loadMore}
                            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                            {loading ? 'Loading...' : 'Load More'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserCard;
