import UserRepositories from '../../../../src/modules/user/user.repositories';
import User from '../../../../src/modules/user/user.models';
import Profile from '../../../../src/modules/profile/profile.models';
import { startSession } from 'mongoose';

const { createNewUser, findUserByEmail, resetPassword, verifyUser } =
  UserRepositories;

jest.mock('../../../../src/modules/user/user.models');
jest.mock('../../../../src/modules/profile/profile.models');
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    startSession: jest.fn(),
  };
});

describe('UserRepositories Unit Test', () => {
  describe('findUserByEmail', () => {
    it('it should be return a user object if the user found', async () => {
      const mockEmail = 'test@example.mail';
      const mockUser = { email: 'test@example.mail' };
      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
      const result = await findUserByEmail(mockEmail);
      expect(result).toBe(mockUser);
    });
    it('it should be return null if the user not found', async () => {
      const mockEmail = 'tes@xample.mail';
      jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);
      const result = await findUserByEmail(mockEmail);
      expect(result).toBeNull();
    });
    it('it should be throw error', async () => {
      const mockEmail = 'test@example.mail';
      const databaseError = new Error('Database Error');
      jest.spyOn(User, 'findOne').mockRejectedValue(databaseError);
      await expect(() => findUserByEmail(mockEmail)).rejects.toThrow(
        'Database Error'
      );
    });
  });

  describe('createNewUser', () => {
    it('should create a new user and commit transaction', async () => {
      const payload = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'test1234',
      };

      const mockSession = {
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        endSession: jest.fn(),
      };

      // @ts-ignore
      (startSession as jest.Mock).mockResolvedValue(mockSession);

      // Mock new User() and new Profile()
      const mockUserInstance = {
        _id: 'mock-user-id',
        save: jest.fn().mockResolvedValue(true),
      };

      const mockProfileInstance = {
        save: jest.fn().mockResolvedValue(true),
      };

      // Mock constructors
      jest
        .mocked(User as unknown as jest.Mock)
        .mockImplementation(() => mockUserInstance);
      jest
        .mocked(Profile as unknown as jest.Mock)
        .mockImplementation(() => mockProfileInstance);

      const result = await createNewUser(payload);

      expect(startSession).toHaveBeenCalled();
      expect(mockSession.startTransaction).toHaveBeenCalled();
      expect(mockProfileInstance.save).toHaveBeenCalledWith({
        session: mockSession,
      });
      expect(mockUserInstance.save).toHaveBeenCalledWith({
        session: mockSession,
      });
      expect(mockSession.commitTransaction).toHaveBeenCalled();
      expect(mockSession.endSession).toHaveBeenCalled();
      expect(result).toEqual(mockUserInstance);
    });

    it('should abort transaction and throw error on failure', async () => {
      const payload = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'test1234',
      };

      const mockSession = {
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        endSession: jest.fn(),
      };

      // @ts-ignore
      (startSession as jest.Mock).mockResolvedValue(mockSession);

      const mockUserInstance = {
        _id: 'mock-user-id',
        save: jest.fn().mockRejectedValue(new Error('Save Failed')),
      };

      const mockProfileInstance = {
        save: jest.fn().mockResolvedValue(true),
      };

      jest
        .mocked(User as unknown as jest.Mock)
        .mockImplementation(() => mockUserInstance);
      jest
        .mocked(Profile as unknown as jest.Mock)
        .mockImplementation(() => mockProfileInstance);

      await expect(createNewUser(payload)).rejects.toThrow('Save Failed');
      expect(mockSession.abortTransaction).toHaveBeenCalled();
      expect(mockSession.endSession).toHaveBeenCalled();
    });
  });
  describe('verifyUser', () => {
    const mockEmail = 'verified@example.com';

    it('should update the isVerified field and return updated user', async () => {
      const mockUpdatedUser = {
        _id: 'mock-id',
        email: mockEmail,
        isVerified: true,
      };

      jest
        .spyOn(User, 'findOneAndUpdate')
        .mockResolvedValueOnce(mockUpdatedUser);

      const result = await verifyUser({ email: mockEmail });

      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { email: mockEmail },
        { $set: { isVerified: true } },
        { new: true }
      );

      expect(result).toEqual(mockUpdatedUser);
    });

    it('should return null if no user is updated', async () => {
      jest.spyOn(User, 'findOneAndUpdate').mockResolvedValueOnce(null);

      const result = await verifyUser({ email: mockEmail });

      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { email: mockEmail },
        { $set: { isVerified: true } },
        { new: true }
      );

      expect(result).toBeNull();
    });

    it('should throw an error if findOneAndUpdate fails', async () => {
      const dbError = new Error('Update failed');
      jest.spyOn(User, 'findOneAndUpdate').mockRejectedValueOnce(dbError);

      await expect(verifyUser({ email: mockEmail })).rejects.toThrow(
        'Update failed'
      );
    });
  });
  describe('resetPassword', () => {
    const mockPayload = {
      userId: 'mock-user-id',
      password: 'newHashedPassword123',
    };

    it('should call findByIdAndUpdate with correct arguments', async () => {
      const spy = jest
        .spyOn(User, 'findByIdAndUpdate')
        .mockResolvedValueOnce(null); 

      await resetPassword(mockPayload);

      expect(spy).toHaveBeenCalledWith(
        mockPayload.userId,
        { $set: { password: mockPayload.password } },
        { new: true }
      );
    });

    it('should throw an error if findByIdAndUpdate fails', async () => {
      const dbError = new Error('Database Error');
      jest.spyOn(User, 'findByIdAndUpdate').mockRejectedValueOnce(dbError);

      await expect(resetPassword(mockPayload)).rejects.toThrow(
        'Database Error'
      );
    });
  });
});
