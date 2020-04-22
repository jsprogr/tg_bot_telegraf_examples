import {UsersRepository} from './usersRepo';

// Database Interface Extensions:
interface IExtensions {
  users: UsersRepository
}

export {
  IExtensions,
  UsersRepository,
};
