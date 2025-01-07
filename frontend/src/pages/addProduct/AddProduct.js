import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../components/product/productForm/productForm";
import {createProduct} from "../../redux/features/product/productSlice.js"
/* 
The AddProduct component is responsible for managing the state and handling actions related to adding a product. This includes state management
for the product's details, image, and description, as well as functions for handling form submission and input changes.
The AddProduct component manages the state and handles actions.
*/

const initialState = {
  name: "",
  category: "",
  quantity: "",
  price: "",
  
};

const AddProduct = () => {
  const dispatch = useDispatch(); 
  const navigate = useNavigate(); 
  const [product, setProduct] = useState(initialState); 
  const [productImage, setProductImage] = useState(""); 
  const [imagePreview, setImagePreview] = useState(null); 
  const [description, setDescription] = useState(""); 

  const { name, category, price, quantity } = product;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if ((name === "price" || name === "quantity") && /[^0-9.]/.test(value)) {
      return; 
    }

    setProduct({ ...product, [name]: value });
  };
  const handleImageChange = (e) => {
    setProductImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const generateKSKU = (category) => {
    const letter = category.slice(0, 3).toUpperCase();
    const number = Date.now();
    const sku = letter + "-" + number;
    return sku;
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("sku", generateKSKU(category));
    formData.append("category", category);
    formData.append("quantity", Number(quantity));
    formData.append("price", price);
    formData.append("description", description);
    formData.append("image", productImage);
    await dispatch(createProduct(formData)); 
    navigate("/dashboard"); 
  };

  return (
    <div>
      <h3  className="--mt">Add Product</h3>
      <ProductForm 
        product={product}
        productImage={productImage}
        imagePreview={imagePreview}
        description={description}
        setDescription={setDescription}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        saveProduct={saveProduct} 
      />
    </div>
  );
};

export default AddProduct;
