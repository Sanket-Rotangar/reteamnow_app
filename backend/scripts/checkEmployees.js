import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employee from '../models/Employee.js';
import config from '../config.js';

dotenv.config();

const checkEmployees = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.MONGO_URI, {
            dbName: config.MONGODB_NAME,
        });
        console.log(`Connected to MongoDB: ${config.MONGODB_NAME}`);

        // Count total employees
        const totalCount = await Employee.countDocuments();
        console.log(`Total employees in database: ${totalCount}`);

        // Get all employees
        const employees = await Employee.find({});
        console.log(`Found ${employees.length} employees:`);

        employees.forEach((emp, index) => {
            console.log(`${index + 1}. ${emp.firstName} ${emp.lastName} - ${emp.email}`);
            console.log(`   Birthday: ${emp.dateOfBirth ? emp.dateOfBirth.toDateString() : 'Not set'}`);
            console.log(`   Joining Date: ${emp.joiningDate ? emp.joiningDate.toDateString() : 'Not set'}`);
            console.log(`   Department: ${emp.department || 'Not set'}`);
            console.log(`   Active: ${emp.isActive}`);
            console.log('---');
        });

        // Check today's birthdays specifically
        const today = new Date();
        const todayMonth = today.getMonth() + 1;
        const todayDate = today.getDate();

        const todaysBirthdays = await Employee.find({
            $expr: {
                $and: [
                    { $eq: [{ $month: "$dateOfBirth" }, todayMonth] },
                    { $eq: [{ $dayOfMonth: "$dateOfBirth" }, todayDate] }
                ]
            }
        });

        console.log(`Today's birthdays (${today.toDateString()}): ${todaysBirthdays.length}`);
        todaysBirthdays.forEach(emp => {
            console.log(`- ${emp.firstName} ${emp.lastName}`);
        });

    } catch (error) {
        console.error('Error checking employees:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

checkEmployees();