import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group mb-3">
            <label>Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group mb-3 position-relative">
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              className="form-control pe-5"
              placeholder="Choose a password"
              autoComplete="off"
              required
            />
            <span
              className="position-absolute"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                top: '68%',
                right: '15px',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#999'
              }}
            >
              {showPassword ? '👁️' : '🙈'}
            </span>
          </div>

          {errors && (
            <div className="alert alert-danger">
              <h6 className="mb-1">Oops...</h6>
              <ul className="mb-0">
                {Array.isArray(errors)
                  ? errors.map((err) => <li key={err.message}>{err.message}</li>)
                  : errors}
              </ul>
            </div>
          )}

          <button className="btn btn-warning w-100 fw-bold text-white">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
