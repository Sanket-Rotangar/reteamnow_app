
import { body, validationResult } from 'express-validator';

export const validatePerson = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('fname').notEmpty().withMessage('First name is required'),
    body('lname').notEmpty().withMessage('Last name is required'),
    body('birthDate').isISO8601().toDate().withMessage('Invalid birth date format'),
    body('joinDate').isISO8601().toDate().withMessage('Invalid join date format'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
