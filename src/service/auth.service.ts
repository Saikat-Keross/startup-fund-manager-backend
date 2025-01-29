import { User } from '../models/user.model'; // Adjust the path as necessary
import { getRepository } from 'typeorm';

export class AuthService {
    private userRepository = getRepository(User);

    async addUser(userData: Partial<User>): Promise<User> {
        const user = this.userRepository.create(userData);
        await this.userRepository.save(user);
        return user;
    }
}