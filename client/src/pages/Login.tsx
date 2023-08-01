import React, { useState } from 'react'
import { login } from '../services/user';
import { useDispatch } from 'react-redux';
import { setUser } from '../store';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setLoading(true);
    try {
      setError(false);
      const { user, token } = await login(email, password);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      dispatch(setUser(user));
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/");
        setLoading(false);
      }, 2000)
    } catch(err) {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <form className='m-auto' style={{ maxWidth: "300px"}} onSubmit={handleSubmit}>
      <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
      {error && 
        <div className="alert alert-danger">
          Unauthorized, please check your credentials
        </div>
      }
      {success &&
        <div className="alert alert-success">
          Login successfull, redirecting to home page
        </div>
      }
      <div className="form-floating mb-2">
        <input type="email" className="form-control" placeholder="name@example.com" onChange={e => setEmail(e.target.value)} required />
        <label>Email address</label>
      </div>
      <div className="form-floating">
        <input type="password" className="form-control" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
        <label>Password</label>
      </div>

      <div className="my-3">
        <Link to="/register">Register</Link>
        <a href=""></a>
      </div>
      <button disabled={loading} className="btn btn-primary w-100 py-2" type="submit">Sign in</button>
    </form>
  )
}

