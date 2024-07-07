import React, { useState } from 'react';
import Loginpic from './login-removebg.png';
import logo from './logo.png';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and Password are required');
      return;
    }

    try {
      const response = await fetch('http://192.168.0.114:8000/auth/token/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await response.json();
      console.log('Token:', data.auth_token); // Store the token as needed
      // Assuming you want to store the token in localStorage
      localStorage.setItem('auth_token', data.auth_token);
      navigate('/Dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen font-sans">
      {/* Left portion */}
      <div className="flex flex-row w-2/5 h-auto">
        <img src={Loginpic} alt="Decoration" className="w-full h-full object-cover" />
      </div>

      {/* Right portion */}
      <div className="flex flex-col w-2/5 items-center p-10 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg">
        {/* <img src={logo} alt="logo" className="w-32 h-32 object-cover mb-8" /> */}
        <section className="w-full">
        <h1 className="py-5 text-center text-5xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
            Legal AI Assistant
          </h1>
          <h1 className="py-5 text-center text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
            Login
          </h1>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="w-full">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Your Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative w-full">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="mt-4 absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 h-full">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 dark:text-gray-300 focus:outline-none"
                  style={{ fontSize: '1.25rem' }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">
                    Remember me
                  </label>
                </div>
              </div>
              <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-purple-500 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
            >
              Log in
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Login;
