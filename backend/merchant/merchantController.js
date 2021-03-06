import asyncHandler from "express-async-handler";
import Product from "../products/productModel.js"

const getProducts = asyncHandler(async (req, res) => {
    try {
      let merchant_id = req.params.id;
      const products = await Product.find({ merchant_id: merchant_id });
  
      res.status(200).json({status: "success",
      message: "All Dues",
      data:{products},});
    } catch (error) {
      res.status(500).send({ status: "Failed", message: error });
    }
  });



const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
  
    if (product) {
      await product.remove();
      res.json({ message: "Product removed" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  });

  export {getProducts, deleteProduct}