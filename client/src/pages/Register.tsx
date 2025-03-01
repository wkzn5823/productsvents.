import React, { useState } from 'react';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await axios.post('http://localhost:8000/api/register', {
        nombre: name,
        email,
        contraseña: password,
      });

      showAlert('Registro exitoso, ahora puedes iniciar sesión.', 'success');

      setName('');
      setEmail('');
      setPassword('');
    } catch (err: unknown) {
      console.error('Error en el registro:', err);

      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 400) {
          showAlert('Datos inválidos. Revisa tu información.', 'warning');
        } else if (err.response.status === 409) {
          showAlert('El usuario ya está registrado.', 'info');
        } else {
          showAlert('Ocurrió un error en el servidor.', 'error');
        }
      } else {
        showAlert('No se pudo conectar con el servidor.', 'error');
      }
    }
  };

  const showAlert = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setAlert({ message, type });

    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>REGÍSTRATE</h2>

      {/* ✅ ALERTA PERSONALIZADA DE MUI */}
      {alert && (
        <Stack sx={styles.alertContainer}>
          <Alert severity={alert.type} onClose={() => setAlert(null)}>
            <AlertTitle>{alert.type === 'success' ? 'Éxito' : alert.type === 'error' ? 'Error' : alert.type === 'warning' ? 'Advertencia' : 'Información'}</AlertTitle>
            {alert.message}
          </Alert>
        </Stack>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputContainer}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo Electrónico"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputContainer}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>REGISTRARME</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    textAlign: 'center' as const,
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '15px',
    textTransform: 'uppercase' as const, 
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  inputContainer: {
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    backgroundColor: 'black',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px',
  },
  alertContainer: {  // ✅ ESTILO PARA ALERTA DE MUI
    width: '100%',
    position: 'absolute' as const,
    top: '20px',
    left: '0%',
    transform: 'translateX(-50%)',
    zIndex: 10,
  },
};

export default Register;
