const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let UserSchema = mongoose.Schema({
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true
    },
    resume: {
        data: Buffer, // Binary data for the file
        contentType: String // MIME type of the file
    }
});

UserSchema.statics.SignUp = async function(user) {
    if (!user) throw new Error("User data is required");

    // Combined query to check for existing user
    let existingUser = await this.findOne({
        $or: [
            { email: user.email },
            { email: user.email },
            { phoneNumber: user.phoneNumber }
        ]
    });

    if (existingUser) {
        if (existingUser.email === user.email) throw new Error("email already exists");
    }

    // Hash password
    let salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // Handle resume field if provided
    if (user.resume) {
        user.resume = {
            data: user.resume.data, // File binary data
            contentType: user.resume.contentType // File MIME type
        };
    }

    // Create user
    user = await this.create(user);
    return user;
};

UserSchema.statics.Login = async function (user) {
    if (!user) throw new Error("Email and password required");


    if (user.email.trim() === "") throw new Error("email is required");
    if (user.password.trim() === "") throw new Error("Password is required");

    // Find user by email
    let data = await this.findOne({ email: user.email });
    if (!data) throw new Error("Account not found");

    // Compare passwords
    let isMatch = await bcrypt.compare(user.password, data.password);
    if (!isMatch) throw new Error("Incorrect password");

    return data;
};

let UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
