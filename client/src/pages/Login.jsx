import { useNavigate } from 'react-router-dom';
import { login } from '../../services/auth';
import { useApi } from '../../hooks/useApi';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { callApi, loading, error } = useApi(login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { success, token } = await callApi(formData);
    if (success) {
      localStorage.setItem('token', token);
      navigate('/user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
      />
      <button disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};