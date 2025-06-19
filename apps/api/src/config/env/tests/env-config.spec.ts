import { envConfig } from '../env-config';
import { local } from '../local';
import { production } from '../production';

describe('envConfig', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should return local config when NODE_ENV is local', () => {
    process.env.NODE_ENV = 'local';
    expect(envConfig()).toEqual(local);
  });

  it('should return production config when NODE_ENV is production', () => {
    process.env.NODE_ENV = 'production';
    expect(envConfig()).toEqual(production);
  });

  it('should return production config when NODE_ENV is undefined', () => {
    delete process.env.NODE_ENV;
    expect(envConfig()).toEqual(production);
  });
});
