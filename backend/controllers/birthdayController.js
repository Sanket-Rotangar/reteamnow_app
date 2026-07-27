import { StatusCodes } from 'http-status-codes';
import Employee from '../models/Employee.js';
import errors from '../errors/index.js';

const { BadRequestError, NotFoundError } = errors;

// Get today's birthdays
export const getTodaysBirthdays = async (req, res) => {
    try {
        const today = new Date();
        const todayMonth = today.getMonth() + 1;
        const todayDate = today.getDate();

        const users = await Employee.find({
            $expr: {
                $and: [
                    { $eq: [{ $month: "$dateOfBirth" }, todayMonth] },
                    { $eq: [{ $dayOfMonth: "$dateOfBirth" }, todayDate] }
                ]
            }
        }).select('firstName lastName email dateOfBirth profilePicture department');

        res.status(StatusCodes.OK).json({
            success: true,
            data: users,
            count: users.length
        });
    } catch (error) {
        console.error('Error fetching today\'s birthdays:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch today\'s birthdays',
            error: error.message
        });
    }
};

// Get upcoming birthdays
export const getUpcomingBirthdays = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

        const users = await Employee.aggregate([
            {
                $match: {
                    dateOfBirth: { $exists: true, $ne: null }
                }
            },
            {
                $addFields: {
                    thisYearBirthday: {
                        $dateFromParts: {
                            year: today.getFullYear(),
                            month: { $month: "$dateOfBirth" },
                            day: { $dayOfMonth: "$dateOfBirth" }
                        }
                    }
                }
            },
            {
                $addFields: {
                    adjustedBirthday: {
                        $cond: {
                            if: { $lt: ["$thisYearBirthday", today] },
                            then: {
                                $dateFromParts: {
                                    year: today.getFullYear() + 1,
                                    month: { $month: "$dateOfBirth" },
                                    day: { $dayOfMonth: "$dateOfBirth" }
                                }
                            },
                            else: "$thisYearBirthday"
                        }
                    }
                }
            },
            {
                $match: {
                    adjustedBirthday: { $gt: today }
                }
            },
            {
                $sort: { adjustedBirthday: 1 }
            },
            {
                $limit: limit
            },
            {
                $addFields: {
                    daysUntil: {
                        $ceil: {
                            $divide: [
                                { $subtract: ["$adjustedBirthday", new Date()] },
                                1000 * 60 * 60 * 24
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    dateOfBirth: 1,
                    profilePicture: 1,
                    department: 1,
                    upcomingBirthday: "$adjustedBirthday",
                    daysUntil: 1
                }
            }
        ]);

        res.status(StatusCodes.OK).json({
            success: true,
            data: users,
            count: users.length
        });
    } catch (error) {
        console.error('Error fetching upcoming birthdays:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch upcoming birthdays',
            error: error.message
        });
    }
};

// Get today's anniversaries
export const getTodaysAnniversaries = async (req, res) => {
    try {
        const today = new Date();
        const todayMonth = today.getMonth() + 1;
        const todayDate = today.getDate();

        const users = await Employee.find({
            $expr: {
                $and: [
                    { $eq: [{ $month: "$joiningDate" }, todayMonth] },
                    { $eq: [{ $dayOfMonth: "$joiningDate" }, todayDate] }
                ]
            }
        }).select('firstName lastName email joiningDate profilePicture department');

        // Calculate years of service
        const usersWithYears = users.map(user => ({
            ...user.toObject(),
            yearsOfService: today.getFullYear() - new Date(user.joiningDate).getFullYear()
        }));

        res.status(StatusCodes.OK).json({
            success: true,
            data: usersWithYears,
            count: usersWithYears.length
        });
    } catch (error) {
        console.error('Error fetching today\'s anniversaries:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch today\'s anniversaries',
            error: error.message
        });
    }
};

// Get upcoming anniversaries
export const getUpcomingAnniversaries = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const today = new Date();

        const users = await Employee.aggregate([
            {
                $match: {
                    joiningDate: { $exists: true, $ne: null }
                }
            },
            {
                $addFields: {
                    thisYearAnniversary: {
                        $dateFromParts: {
                            year: today.getFullYear(),
                            month: { $month: "$joiningDate" },
                            day: { $dayOfMonth: "$joiningDate" }
                        }
                    }
                }
            },
            {
                $addFields: {
                    adjustedAnniversary: {
                        $cond: {
                            if: { $lt: ["$thisYearAnniversary", today] },
                            then: {
                                $dateFromParts: {
                                    year: today.getFullYear() + 1,
                                    month: { $month: "$joiningDate" },
                                    day: { $dayOfMonth: "$joiningDate" }
                                }
                            },
                            else: "$thisYearAnniversary"
                        }
                    }
                }
            },
            {
                $match: {
                    adjustedAnniversary: { $gt: today }
                }
            },
            {
                $sort: { adjustedAnniversary: 1 }
            },
            {
                $limit: limit
            },
            {
                $addFields: {
                    yearsOfService: {
                        $subtract: [
                            { $year: "$adjustedAnniversary" },
                            { $year: "$joiningDate" }
                        ]
                    },
                    daysUntil: {
                        $ceil: {
                            $divide: [
                                { $subtract: ["$adjustedAnniversary", new Date()] },
                                1000 * 60 * 60 * 24
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    joiningDate: 1,
                    profilePicture: 1,
                    department: 1,
                    upcomingAnniversary: "$adjustedAnniversary",
                    yearsOfService: 1,
                    daysUntil: 1
                }
            }
        ]);

        res.status(StatusCodes.OK).json({
            success: true,
            data: users,
            count: users.length
        });
    } catch (error) {
        console.error('Error fetching upcoming anniversaries:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch upcoming anniversaries',
            error: error.message
        });
    }
};

// Get new joinees
export const getNewJoinees = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const users = await Employee.aggregate([
            {
                $match: {
                    joiningDate: { $gte: thirtyDaysAgo }
                }
            },
            {
                $addFields: {
                    daysWorked: {
                        $ceil: {
                            $divide: [
                                { $subtract: [new Date(), "$joiningDate"] },
                                1000 * 60 * 60 * 24
                            ]
                        }
                    }
                }
            },
            {
                $sort: { joiningDate: -1 }
            },
            {
                $limit: limit
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    joiningDate: 1,
                    profilePicture: 1,
                    department: 1,
                    daysWorked: 1
                }
            }
        ]);

        res.status(StatusCodes.OK).json({
            success: true,
            data: users,
            count: users.length
        });
    } catch (error) {
        console.error('Error fetching new joinees:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch new joinees',
            error: error.message
        });
    }
};

// Employee Management Functions

// Create new employee
export const createEmployee = async (req, res) => {
    try {
        const { userId, firstName, lastName, email, dateOfBirth, joiningDate, profilePicture, department } = req.body;

        const employee = new Employee({
            userId,
            firstName,
            lastName,
            email,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            joiningDate: joiningDate ? new Date(joiningDate) : null,
            profilePicture: profilePicture || "",
            department: department || ""
        });

        await employee.save();

        res.status(StatusCodes.CREATED).json({
            success: true,
            data: employee,
            message: 'Employee created successfully'
        });
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to create employee',
            error: error.message
        });
    }
};

// Update employee
export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, dateOfBirth, joiningDate, profilePicture, department } = req.body;

        const updateData = {
            firstName,
            lastName,
            email,
            profilePicture,
            department
        };

        if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);
        if (joiningDate) updateData.joiningDate = new Date(joiningDate);

        const employee = await Employee.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!employee) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(StatusCodes.OK).json({
            success: true,
            data: employee,
            message: 'Employee updated successfully'
        });
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to update employee',
            error: error.message
        });
    }
};

// Get all employees
export const getAllEmployees = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const employees = await Employee.find({ isActive: true })
            .populate('userId', 'fname lname email')
            .sort({ firstName: 1 })
            .skip(skip)
            .limit(limit);

        const total = await Employee.countDocuments({ isActive: true });

        res.status(StatusCodes.OK).json({
            success: true,
            data: employees,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch employees',
            error: error.message
        });
    }
};

// Get employee by ID
export const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findById(id).populate('userId', 'fname lname email');

        if (!employee) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(StatusCodes.OK).json({
            success: true,
            data: employee
        });
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch employee',
            error: error.message
        });
    }
};