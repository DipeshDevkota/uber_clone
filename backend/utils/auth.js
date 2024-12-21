const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const hashPassword = async (password) => {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        console.log('Generated salt:', salt);
        
        // Hash password with the generated salt
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('Hashing details:');
        console.log('Input password:', password);
        console.log('Generated hash:', hashedPassword);
        
        // Verify the hash immediately
        const verifyHash = await bcrypt.compare(password, hashedPassword);
        console.log('Immediate verification:', verifyHash);
        
        return hashedPassword;
    } catch (error) {
        console.error('Error in hashPassword:', error);
        throw error;
    }
};

const comparePasswords = async (plainPassword, hashedPassword) => {
    try {
        // Clean up inputs
        const cleanPlainPassword = String(plainPassword).trim();
        const cleanHashedPassword = String(hashedPassword).trim();
        

        console.log('Compare passwords debug:');
        console.log('Clean plain password:', cleanPlainPassword);
        console.log('Clean hashed password:', cleanHashedPassword);
        
        // Perform comparison
        const isMatch = await bcrypt.compare(cleanPlainPassword, cleanHashedPassword);
        console.log('bcrypt.compare result:', isMatch);
        
        return isMatch;
    } catch (error) {
        console.error('Error in comparePasswords:', error);
        throw error;
    }
};

module.exports = { hashPassword, comparePasswords };