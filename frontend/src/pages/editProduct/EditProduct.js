import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../../components/product/productForm/productForm";
import { getProduct, getProducts, selectProduct, updateProduct } from "../../redux/features/product/productSlice";

const EditProduct = () => {
  const { id } = useParams(); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productEdit = useSelector(selectProduct); // Gets the product data from the Redux store using the selector selectProduct 

  const [product, setProduct] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    description: "",
    image: null,
  }); 
  const [productImage, setProductImage] = useState(""); 
  const [imagePreview, setImagePreview] = useState(null); 
  const [description, setDescription] = useState(""); 

  // gets the product which updates the product currently stored in the redux store 
  useEffect(() => {
    dispatch(getProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (productEdit) { 
      setProduct(productEdit);
      setImagePreview(productEdit.image ? `${productEdit.image.filePath}` : null); 
      setDescription(productEdit.description || "");
    }
  }, [productEdit]);

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

  const saveProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", product.name); 
    formData.append("category", product.category); 
    formData.append("quantity", product.quantity);
    formData.append("price", product.price);
    formData.append("description", description);
    if (productImage) {
      formData.append("image", productImage);
    }

    try {
      await dispatch(updateProduct({ id, formData }));
      await dispatch(getProducts());
      navigate("/dashboard"); 
    } catch (error) {
      console.error("Failed to save the product:", error);
    }
  };

  return (
    <div>
      <h3 className="--mt">Edit Product</h3>
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

export default EditProduct;