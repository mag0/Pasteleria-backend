import { body } from "express-validator";

export const validateProductInput = [
    body('name')
        .notEmpty()
        .withMessage('El nombre no puede estar vacío'),
    body('price')
        .isNumeric()
        .withMessage('El precio debe ser un número'),
    body('description')
        .notEmpty()
        .withMessage('La descripción no puede estar vacía'),
    body('category')
        .notEmpty()
        .withMessage('La categoría no puede estar vacía')
];
