import { getEnvVariable } from '../../../src/utils/getEnvVariables.utils';

describe('getEnvVariable', () => {
  it('it should be check is the utility function successfully load the env variable value', () => {
    const value = getEnvVariable('NODE_ENV');
    expect(value).toBe('test');
  });
  it('it should be throw error if the key with value not found in .env', () => {
    expect(() => getEnvVariable('NOT_FOUND')).toThrow(
      `Missing Environment Variable: ${'NOT_FOUND'}`
    );
  });
});
