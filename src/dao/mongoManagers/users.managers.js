import UsersModel from "../models/users.model.js";
import EnumErrors from '../../utils/errorHandler/enum.js';
import CustomError from '../../utils/errorHandler/CustomError.js';

class UserMongoManager {
    constructor() {
        this.usersModel = UsersModel;
    }
    getUserByEmail = async (email) => {
        try {
            const user = await this.usersModel.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
            return user;
        } catch (error) {
            CustomError.createError({
                name: 'getUserByEmail Error',
                message: `Failed to retrieve user: ${error.message}`,
                type: EnumErrors.DATABASE_ERROR.type,
                statusCode: EnumErrors.DATABASE_ERROR.statusCode
            });
        }
    }

    updateUser = async (userId, updatedFields) => {
        try {
            const { role } = updatedFields;
            const updatedUser = await this.usersModel.findByIdAndUpdate(userId, { role: role }, { new: true });
            if (!updatedUser) {
                CustomError.createError({
                    name: 'updateUser Error',
                    message: 'User not found',
                    type: EnumErrors.DATABASE_ERROR.type,
                    statusCode: EnumErrors.DATABASE_ERROR.statusCode
                });
            }
            return updatedUser;
        } catch (error) {
            CustomError.createError({
                name: 'updateUser Error',
                message: `Failed to update user: ${error.message}`,
                type: EnumErrors.DATABASE_ERROR.type,
                statusCode: EnumErrors.DATABASE_ERROR.statusCode
            });
        }
    }

}

export default UserMongoManager;