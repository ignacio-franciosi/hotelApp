// Importamos herramientas de Vitest y React Testing Library
import { describe, it, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Register from './Register';

describe('Register Page', () => {
  // Función auxiliar para renderizar el componente Register envuelto en Router
  const renderWithRouter = () => {
    render(
      <Router>
        <Register />
      </Router>
    );
  };

  // Antes de cada test, restauramos mocks y evitamos que `alert` bloquee
  beforeEach(() => {
    vi.restoreAllMocks();              // Limpia mocks anteriores
    global.alert = vi.fn();            // Mock del alert del navegador
  });

  // Test: validación de campos vacíos
  it('debería mostrar una alerta si los campos están vacíos', async () => {
    renderWithRouter();

    // Simula clic en el botón de registro sin completar campos
    const button = screen.getByRole('button', { name: /registrarse/i });
    fireEvent.click(button);

    // Espera que se muestre la alerta de campos incompletos
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Debes completar todos los campos');
    });
  });

  // Test: registro exitoso
  it('debería mostrar una alerta de éxito y navegar si el registro es correcto', async () => {
    // Mock de fetch que simula respuesta exitosa (usuario creado)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({ ok: true }));

    renderWithRouter();

    // Simula llenar los campos del formulario
    fireEvent.change(screen.getByPlaceholderText(/nombre/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByPlaceholderText(/correo/i), { target: { value: 'juan@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), { target: { value: '123456' } });

    // Simula clic en el botón de registro
    const button = screen.getByRole('button', { name: /registrarse/i });
    fireEvent.click(button);

    // Verifica que se muestra mensaje de éxito
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Gracias por registrarte! ahora puedes iniciar sesión :)');
    });
  });

  // Test: usuario ya registrado
  it('debería mostrar una alerta de error si el usuario ya está registrado', async () => {
    // Mock de fetch que simula error en el registro (correo repetido)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({ ok: false }));

    renderWithRouter();

    // Simula llenar el formulario con un correo ya registrado
    fireEvent.change(screen.getByPlaceholderText(/nombre/i), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByPlaceholderText(/correo/i), { target: { value: 'ana@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), { target: { value: 'password' } });

    // Simula clic en el botón de registro
    const button = screen.getByRole('button', { name: /registrarse/i });
    fireEvent.click(button);

    // Verifica que se muestra la alerta de error correspondiente
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('El correo electrónico ya está registrado');
    });
  });
});
