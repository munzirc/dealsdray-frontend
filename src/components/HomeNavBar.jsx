import React from "react";
import { Link } from "react-router-dom";

const HomeNavBar = ({ currPage }) => {
  return (
    <div className="h-16 flex bg-slate-300 px-20 items-center">
      <div className="h-full flex gap-5">
        <div className={`h-full ${currPage === 'home' ? "border-b-2 border-red-600" : "" }     flex items-center px-2`}>
          <Link to='/home' className="font-bold">Home</Link>{" "}
        </div>

        <div className={`h-full ${currPage === 'details' ? "border-b-2 border-red-600" : "" } flex items-center px-2`}>
          <Link to='/employee-details' className="font-bold">Employee List</Link>{" "}
        </div>
      </div>
    </div>
  );
};

export default HomeNavBar;
