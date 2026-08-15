import { LoginUsuario } from './login-usuario';

describe('LoginUsuario', () => {
  it('should create an instance with the provided credentials', () => {
    const login = new LoginUsuario('test@example.com', 'secret');

    expect(login.email).toBe('test@example.com');
    expect(login.password).toBe('secret');
  });
});
