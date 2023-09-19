export default class UsersRepository {

    constructor(dao) {
        this.dao = dao;
    }

    getUserByEmail = async (email) => {
        const user = await this.dao.getUserByEmail(email);
        return user;
    }

    updateUser = async (userId, updatedFields) => {
        const updatedUser = await this.dao.updateUser(userId, updatedFields);
        return updatedUser;
    }

}