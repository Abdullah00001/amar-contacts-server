import mailOption from '../../../src/utils/mailOption.utils';

describe('Mail Option Utility', () => {
  it('it should be return an object', () => {
    const result = mailOption(
      'mock@example.com',
      'test',
      '<h1>hello world</h1>'
    );
    expect(typeof result).toBe('object');
  });
});
