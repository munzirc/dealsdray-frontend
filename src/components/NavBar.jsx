import { Button } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const NavBar = () => {
  
  const {authUser, setAuthUser} = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogout = () => {
      localStorage.removeItem('username');
      setAuthUser(null);
      navigate('/')
  }

  return (
    <div className="h-16 bg-gray-100 fixed right-0 left-0 top-0 px-20">
      <div className="w-full h-full flex justify-between items-center">
        <div className="h-full w-16">
          <img src="/dealsdray_logo.png" alt="Logo" className="w-full h-full" />
        </div>

        <div className="flex items-center gap-10">
          {authUser && (
            <>
              <span>{authUser}</span>
              <Button variant="contianed" sx={{ backgroundColor: "red", color: 'white', '&:hover': {
                        backgroundColor: 'white',
                        color: 'red',
                    }, }} 
                    onClick={handleLogout}>Logout </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
