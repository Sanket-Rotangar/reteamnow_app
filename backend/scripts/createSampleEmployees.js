import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employee from '../models/Employee.js';
import config from '../config.js';

dotenv.config();

const sampleEmployees = [
    {
        userId: new mongoose.Types.ObjectId(),
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@company.com",
        dateOfBirth: new Date("1990-07-17"),
        joiningDate: new Date("2020-01-15"),
        department: "Engineering",
        profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
        userId: new mongoose.Types.ObjectId(),
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@company.com",
        dateOfBirth: new Date("1988-07-22"),
        joiningDate: new Date("2019-05-10"),
        department: "Marketing",
        profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
        userId: new mongoose.Types.ObjectId(),
        firstName: "Mike",
        lastName: "Johnson",
        email: "mike.johnson@company.com",
        dateOfBirth: new Date("1992-12-03"),
        joiningDate: new Date("2021-09-01"),
        department: "Sales",
        profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
        userId: new mongoose.Types.ObjectId(),
        firstName: "Sarah",
        lastName: "Wilson",
        email: "sarah.wilson@company.com",
        dateOfBirth: new Date("1985-11-18"),
        joiningDate: new Date("2018-03-20"),
        department: "HR",
        profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
        userId: new mongoose.Types.ObjectId(),
        firstName: "David",
        lastName: "Brown",
        email: "david.brown@company.com",
        dateOfBirth: new Date("1991-05-08"),
        joiningDate: new Date("2022-01-10"),
        department: "Engineering",
        profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    {
        userId: new mongoose.Types.ObjectId(),
        firstName: "Emily",
        lastName: "Davis",
        email: "emily.davis@company.com",
        dateOfBirth: new Date("1993-07-17"),
        joiningDate: new Date("2025-07-17"),
        department: "Design",
        profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    },
    {
        userId: new mongoose.Types.ObjectId(),
        firstName: "Alex",
        lastName: "Rodriguez",
        email: "alex.rodriguez@company.com",
        dateOfBirth: new Date("1987-01-30"),
        joiningDate: new Date("2019-08-15"),
        department: "Product Management",
        profilePicture: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face"
    },
    {
        userId: new mongoose.Types.ObjectId(),
        firstName: "Lisa",
        lastName: "Chen",
        email: "lisa.chen@company.com",
        dateOfBirth: new Date("1989-09-12"),
        joiningDate: new Date("2020-06-08"),
        department: "Data Science",
        profilePicture: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face"
    },
    {
        userId: new mongoose.Types.ObjectId(),
        firstName: "Robert",
        lastName: "Taylor",
        email: "robert.taylor@company.com",
        dateOfBirth: new Date("1984-04-25"),
        joiningDate: new Date("2017-11-12"),
        department: "DevOps",
        profilePicture: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face"
    },
    {
        userId: new mongoose.Types.ObjectId(),
        firstName: "Amanda",
        lastName: "White",
        email: "amanda.white@company.com",
        dateOfBirth: new Date("1991-06-18"),
        joiningDate: new Date("2022-02-14"),
        department: "Finance",
        profilePicture: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
    },
    {
        userId: new mongoose.Types.ObjectId(),
        firstName: "Kevin",
        lastName: "Martinez",
        email: "kevin.martinez@company.com",
        dateOfBirth: new Date("1986-12-07"),
        joiningDate: new Date("2018-09-03"),
        department: "QA",
        profilePicture: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face"
    },
    {
        userId: new mongoose.Types.ObjectId(),
        firstName: "Rachel",
        lastName: "Anderson",
        email: "rachel.anderson@company.com",
        dateOfBirth: new Date("1994-02-28"),
        joiningDate: new Date("2023-01-16"),
        department: "Marketing",
        profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    {
        userId: new mongoose.Types.ObjectId(),
        firstName: "Thomas",
        lastName: "Garcia",
        email: "thomas.garcia@company.com",
        dateOfBirth: new Date("1988-10-11"),
        joiningDate: new Date("2019-12-02"),
        department: "Engineering",
        profilePicture: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop&crop=face"
    },
    {
        userId: new mongoose.Types.ObjectId(),
        firstName: "Nicole",
        lastName: "Thompson",
        email: "nicole.thompson@company.com",
        dateOfBirth: new Date("1992-07-19"),
        joiningDate: new Date("2021-05-24"),
        department: "Operations",
        profilePicture: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face"
    },
    {
        userId: new mongoose.Types.ObjectId(),
        firstName: "Daniel",
        lastName: "Lee",
        email: "daniel.lee@company.com",
        dateOfBirth: new Date("1985-03-06"),
        joiningDate: new Date("2018-04-17"),
        department: "Security",
        profilePicture: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face"
    },
    {
        userId: new mongoose.Types.ObjectId(),
        firstName: "Jessica",
        lastName: "Miller",
        email: "jessica.miller@company.com",
        dateOfBirth: new Date("1990-11-23"),
        joiningDate: new Date("2020-10-05"),
        department: "Legal",
        profilePicture: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face"
    },
    {
        userId: new mongoose.Types.ObjectId(),
        firstName: "Christopher",
        lastName: "Wilson",
        email: "christopher.wilson@company.com",
        dateOfBirth: new Date("1987-05-16"),
        joiningDate: new Date("2019-01-28"),
        department: "Sales",
        profilePicture: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face"
    },
    {
        userId: new mongoose.Types.ObjectId(),
        firstName: "Stephanie",
        lastName: "Moore",
        email: "stephanie.moore@company.com",
        dateOfBirth: new Date("1993-01-09"),
        joiningDate: new Date("2022-07-11"),
        department: "Customer Success",
        profilePicture: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=150&h=150&fit=crop&crop=face"
    },
    {
        userId: new mongoose.Types.ObjectId(),
        firstName: "Ryan",
        lastName: "Jackson",
        email: "ryan.jackson@company.com",
        dateOfBirth: new Date("1989-08-02"),
        joiningDate: new Date("2020-03-09"),
        department: "Engineering",
        profilePicture: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=face"
    },
    {
        userId: new mongoose.Types.ObjectId(),
        firstName: "Michelle",
        lastName: "Clark",
        email: "michelle.clark@company.com",
        dateOfBirth: new Date("1986-04-14"),
        joiningDate: new Date("2018-12-03"),
        department: "HR",
        profilePicture: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=150&h=150&fit=crop&crop=face"
    }
];

const createSampleEmployees = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.MONGO_URI, {
            dbName: config.MONGODB_NAME,
        });
        console.log(`Connected to MongoDB: ${config.MONGODB_NAME}`);

        // Clear existing sample data (optional)
        await Employee.deleteMany({ email: { $in: sampleEmployees.map(emp => emp.email) } });

        // Insert sample employees
        const createdEmployees = await Employee.insertMany(sampleEmployees);
        console.log(`Created ${createdEmployees.length} sample employees`);

        // Display created employees
        createdEmployees.forEach(emp => {
            console.log(`- ${emp.firstName} ${emp.lastName} (${emp.department})`);
        });

    } catch (error) {
        console.error('Error creating sample employees:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

createSampleEmployees();