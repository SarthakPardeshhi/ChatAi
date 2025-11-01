import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword } from '../../utils/helpers';
import Toast from '../common/Toast';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/chat');
    }
  }, [isAuthenticated, navigate]);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      showToast('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      showToast('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      showToast('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password, rememberMe);
      navigate('/chat');
    } catch (error) {
      if (error.message.includes('credentials') || error.message.includes('401')) {
        showToast('Invalid email or password');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        showToast('Unable to connect. Please try again.');
      } else {
        showToast(error.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      <div className="login-left-panel">
        <div className="login-brand">
          <h1 className="login-brand-title">ChatAi</h1>
          <p className="login-brand-tagline">Connect and chat with friends</p>
        </div>
      </div>

      <div className="login-right-panel">
        <div className="login-form-container">
          <h2 className="login-form-title">Welcome Back</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-field">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                disabled={isLoading}
              />
            </div>

            <div className="login-form-field">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                disabled={isLoading}
              />
            </div>

            <div className="login-form-field login-remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>

            <button
              type="submit"
              className="login-submit-button"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
