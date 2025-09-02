import { Request, Response } from 'express';
import Product from "../models/Product";
import fs from "fs";
import path from "path";

interface MulterRequest extends Request {
    file: Express.Multer.File;
}


export class ProductController {
    static async getAllProducts(req: Request, res: Response) {
        try {
            const products = await Product.find();
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getProductById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await Product.findById(id).select('-__v');

            if (!product) {
                return res.status(404).json({ message: 'El producto no existe' });
            }

            res.json(product);
        } catch (error) {
            res.status(500).json({ message: 'Hubo un error al buscar el producto' });
        }
    }

    static async createProduct(req: MulterRequest, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "La imagen no puede estar vacía" });
            }

            const { name, price, description, category } = req.body;

            const existingName = await Product.findOne({ name });
            if (existingName) {
                const imagePath = path.resolve("public", "uploads", req.file.filename);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
                return res.status(409).json({ message: "Ya existe un producto con ese nombre" });
            }

            const imagePath = `/uploads/${req.file.filename}`;

            const newProduct = new Product({
                name,
                price,
                description,
                category,
                image: imagePath
            });

            await newProduct.save();
            res.status(201).json(newProduct);
        } catch (error: any) {
            if (error.code === 11000 && error.keyPattern?.image) {
                return res.status(409).json({ message: "Ya existe un producto con esa imagen" });
            }

            res.status(500).json({ message: error.message });
        }
    }

    static async updateProduct(req: MulterRequest, res: Response) {
        try {
            const { id } = req.params;
            const { name, price, description, category } = req.body;

            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ message: "Producto no encontrado" });
            }

            // Si hay nueva imagen, eliminar la anterior del disco
            if (req.file && product.image) {
                const oldImagePath = path.resolve("public", "uploads", product.image.replace("/uploads/", ""));
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
                product.image = `/uploads/${req.file.filename}`;
            }

            const existingName = await Product.findOne({ name });
            if (existingName && existingName._id.toString() !== id) {
                return res.status(409).json({ message: "Ya existe un producto con ese nombre" });
            }

            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.category = category || product.category;

            await product.save();
            res.status(200).json(product);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ message: "Producto no encontrado" });
            }

            // Eliminar imagen del disco si existe
            if (product.image) {
                const imagePath = path.resolve("public", "uploads", product.image.replace("/uploads/", ""));

                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            await product.deleteOne();
            res.status(200).json({ message: "Producto eliminado correctamente" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}