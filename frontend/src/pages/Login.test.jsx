// Importamos herramientas de Vitest y React Testing Library
import { describe, it, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './Login';

// Describe para agrupar pruebas relacionadas a Login
describe('Login Page', () => {
  // Función auxiliar para renderizar el componente Login con Router
  const renderWithRouter = () => {
    render(
      <Router>
        <Login />
      </Router>
    );
  };

  // Antes de cada test limpiamos mocks y reemplazamos alert
  beforeEach(() => {
    vi.restoreAllMocks();
    global.alert = vi.fn();
  });

  // Test: muestra alerta si campos están vacíos
  it('debería mostrar una alerta si los campos están vacíos', async () => {
    renderWithRouter();

    const button = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Debes completar todos los campos');
    });
  });

  // Test: muestra alerta si el usuario no está registrado
  it('debería mostrar una alerta si el usuario no está registrado', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({ ok: false }));

    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText(/correo/i), {
      target: { value: 'noexiste@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: 'incorrecta' },
    });

    const button = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Usuario no registrado');
    });
  });

  // Test: login exitoso con datos correctos
  it('debería iniciar sesión correctamente si los datos son válidos', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id_user: 123,
        token: 'token123',
        tipo: 'user'
      }),
    }));

    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText(/correo/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: '123456' },
    });

    const button = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.alert).not.toHaveBeenCalled(); // No debería mostrar alertas
    });
  });
});
