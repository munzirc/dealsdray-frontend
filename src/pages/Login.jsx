import React, { useContext, useState } from "react";
import { Alert, Box, Button, CircularProgress, TextField } from "@mui/material";
import {useNavigate} from 'react-router-dom';
import { UserContext } from "../context/UserContext";

const Login = () => {
  const [user, setUser] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {setAuthUser} = useContext(UserContext);

  const navigate = useNavigate();

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  console.log(user);

  const validate = () => {
    let tempErrors = { username: "", password: "" };

    tempErrors.username = user.username ? "" : "Username is required";

    tempErrors.password = user.password ? "" : "Password is required";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((error) => error === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        setLoading(true);
        const baseuri = import.meta.env.VITE_BASE_URL;
        const response = await fetch(`${baseuri}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });
        const data = await response.json();
        if(data.error) {
          throw new Error(data.error)
        }
        setAuthUser(data.username);
        localStorage.setItem('username',data.username);
        navigate('/home');
      } catch (error) {
        setLoading(false);
        setError(error.message)
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        className="w-96 bg-gray-200 py-5 px-10 mt-28 rounded-md flex flex-col items-center space-y-5"
      >
        <p className="text-3xl font-bold text-red-600">Login</p>

        <TextField
          id="username"
          label="Username"
          variant="outlined"
          name="username"
          fullWidth
          value={user.username}
          error={!!Boolean(errors.username)}
          helperText={errors.username}
          onChange={onChange}
          required
        />

        <TextField
          id="password"
          type="password"
          label="Password"
          variant="outlined"
          value={user.password}
          name="password"
          fullWidth
          error={!!Boolean(errors.password)}
          helperText={errors.password}
          onChange={onChange}
          required
        />

        <Button type="submit" fullWidth variant="contained" color="success">
          {loading ? <CircularProgress sx={{color: 'white'}}/> : "Login" }
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </div>
  );
};

export default Login;
