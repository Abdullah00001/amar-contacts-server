import User from '../../../src/modules/user/user.models';
import UserRepositories from '../../../src/modules/user/user.repositories';

const {} = UserRepositories;

jest.mock('../../../src/modules/user/user.models');
jest.mock('../../../src/modules/profile/profile.models');
jest.mock('mongoose', () => {
  const actual = jest.requireActual('mongoose');
  return {
    ...actual,
    startSession: jest.fn(),
  };
});
