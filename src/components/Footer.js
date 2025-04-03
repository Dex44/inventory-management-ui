import React, { useEffect, useState } from "react";

const Footer = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem('userData')))    
  }, []);

  return (
    <footer className="bg-indigo-400 text-white py-4 fixed bottom-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>
          Logged in as: <span className="font-bold">{userData?.username ? userData?.username : 'User'}</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
