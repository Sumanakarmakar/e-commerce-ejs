const bcrypt=require('bcryptjs')

module.exports= hashPassword = async (password) => {
    try {
        const saltPassword = 10;
        const hashPassword = await bcrypt.hash(password, saltPassword)
        return hashPassword;
    } catch (error) {
        console.log(error);
    }

}