
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        preferences: {
            darkMode: { type: Boolean, default: false },
            notifications: { type: Boolean, default: true },
            reminderMode: { type: Boolean, default: true }, // Global ON/OFF for reminders
        },
        caregiver: {
            name: { type: String, default: "" },
            email: { type: String, default: "" },
            phone: { type: String, default: "" },
            isVerified: { type: Boolean, default: false }
        },
        googleCalendarToken: {
            type: Object, // Stores access_token, refresh_token, scope, token_type, expiry_date
            default: null
        },
    },
    {
        timestamps: true,
    }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
