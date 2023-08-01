import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { register } from '../services/user';

export default function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setErrors([]);
    if (password !== passwordConfirmation) {
      return setErrors(["Passwords do not match"]);
    }
    setLoading(true);
    try {
      await register({name, password, email});
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/login");
        setLoading(false);
      }, 2000)
    } catch(err: any) {
      let data = Object.values(err?.response?.data || {}).flat() as string[];
      if (!data.length) {
        data.push("Form is invalid");
      }
      setErrors(data);
      setLoading(false);
    }
  }

  return (
    <form className='mx-auto' style={{maxWidth: "500px"}} onSubmit={handleSubmit}>
      {errors.map(item => 
        <div className="alert alert-danger" key={item}>{item}</div>
      )}
      {success &&
        <div className="alert alert-success">
          Registration is successful, redirecting to login page.
        </div>
      }

      <div className="mb-3">
        <label className="form-label">Name</label>
        <input type="name" className="form-control" onChange={ev => setName(ev.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label">Email address</label>
        <input type="email" className="form-control" onChange={ev => setEmail(ev.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input type="password" className="form-control" onChange={ev => setPassword(ev.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label">Password confirmation</label>
        <input type="password" className="form-control" onChange={ev => setPasswordConfirmation(ev.target.value)} />
      </div>

      <button disabled={loading} className="btn btn-primary w-100 py-2" type="submit">Sign in</button>
    </form>
  )
}

