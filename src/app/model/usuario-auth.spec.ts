import { UsuarioAuth } from './usuario-auth';

const username: string = 'dummy';
const token: string = 'dummy-token';
const fullname: string = 'dummy 1234';
const id: number = 1;

describe('UsuarioAuth', () => {
  it('should create an instance with the provided data', () => {
    const auth = new UsuarioAuth(username, token, fullname, id);

    expect(auth.username).toBe(username);
    expect(auth.token).toBe(token);
    expect(auth.fullname).toBe(fullname);
    expect(auth.id).toBe(id);
  });
});
