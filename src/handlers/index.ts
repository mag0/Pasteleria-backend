import { Request, Response } from 'express'
import slug from 'slug'
import formidable from 'formidable'
import { v4 as uuid } from 'uuid'
import cloudinary from "../config/cloudinary"
import Product from "../models/Product"
import mongoose from 'mongoose'
import { File } from "multer";


interface MulterRequest extends Request {
    file: File;
}


export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find()
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).select('-_id -__v');

        if (!product) {
            const error = new Error('El producto no existe');
            return res.status(404).json({ error: error.message });
        }

        res.json(product);
    } catch (e) {
        const error = new Error('Hubo un error al buscar el producto');
        return res.status(500).json({ error: error.message });
    }
};

export const createProduct = async (req: MulterRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "La imagen no puede estar vacía" });
        }

        const result = await cloudinary.uploader.upload_stream(
            { folder: 'productos' },
            async (error, result) => {
                if (error || !result) {
                    return res.status(500).json({ message: 'Error al subir imagen a Cloudinary' });
                }

                const { name, price, description, category } = req.body;

                const newProduct = new Product({
                    name,
                    price,
                    description,
                    category,
                    image: result.secure_url,
                });

                await newProduct.save();
                res.status(201).json(newProduct);
            }
        );

        result.end(req.file.buffer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
