import { Usuario } from './usuario';

describe('Usuario', () => {
  it('should create an instance with the provided data', () => {
    const usuario = new Usuario('Juan', 'Perez', 'juan@example.com', 'secret');

    expect(usuario.nombre).toBe('Juan');
    expect(usuario.apellidos).toBe('Perez');
    expect(usuario.email).toBe('juan@example.com');
    expect(usuario.password).toBe('secret');
  });
});
