import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        dateOfBirth: { type: Date },
        joiningDate: { type: Date },
        profilePicture: { type: String, default: "" },
        department: { type: String, default: "" },
        isActive: { type: Boolean, default: true }
    },
    {
        timestamps: true,
        autoIndex: true
    }
);

// Index for efficient birthday queries
employeeSchema.index({ dateOfBirth: 1 });
employeeSchema.index({ joiningDate: 1 });
employeeSchema.index({ userId: 1 });

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;