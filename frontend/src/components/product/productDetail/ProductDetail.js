import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useRedirectLoggedOutUser from "../../../customHook/useRedirectLoggedOutUser";
import { selectIsLoggedIn } from "../../../redux/features/auth/authSlice";
import { getProducts } from "../../../redux/features/product/productSlice";
import Card from "../../card/Card";
import "./ProductDetail.scss";

const ProductDetail = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { products, isError, message } = useSelector((state) => state.product);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getProducts());
    }

    if (isError) {
      console.error(message);
    }
  }, [isLoggedIn, isError, message, dispatch]);

  // Sort products by creation time in increasing order
  const sortedProducts = products
    ? [...products].sort((a, b) =>
        new Date(a.createdAt) - new Date(b.createdAt)
      )
    : [];

  return (
    <div className="parent-container">
      <div className="product-detail">
        <h3 className="--mt">All Products</h3>
        {sortedProducts && sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <Card key={product._id} cardClass="card">
              <div className="detail">
                <Card cardClass="group">
                  {product?.image ? (
                    <img
                      src={product.image.filePath}
                      alt={product.image.fileName || "Product Image"}
                      onError={(e) => {
                        e.target.style.display = "none";
                        console.error("Failed to load image:", product.image.filePath);
                      }}
                    />
                  ) : (
                    <p>No image set for this product</p>
                  )}
                </Card>
                <h4>
                  Product Availability:{" "}
                  {product.quantity > 0 ? (
                    <span className="--color-success">In Stock</span>
                  ) : (
                    <span className="--color-danger">Out Of Stock</span>
                  )}
                </h4>
                <hr />
                <p>
                  <b>&rarr; Name: </b> {product.name}
                </p>
                <p>
                  <b>&rarr; SKU : </b> {product.sku}
                </p>
                <p>
                  <b>&rarr; Category : </b> {product.category}
                </p>
                <p>
                  <b>&rarr; Price : </b> ${product.price}
                </p>
                <p>
                  <b>&rarr; Total Value in stock : </b> $
                  {product.price * product.quantity}
                </p>
                {product.description && (
                  <p>
                    <b>&rarr; Description: </b>{" "}
                    <span
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  </p>
                )}
                <hr />
                <code className="timestamps">
                  Created on:{" "}
                  {product.createdAt
                    ? new Date(product.createdAt).toLocaleString("en-US")
                    : "N/A"}
                </code>
                <code className="timestamps">
                  Last Updated:{" "}
                  {product.updatedAt
                    ? new Date(product.updatedAt).toLocaleString("en-US")
                    : "N/A"}
                </code>
              </div>
            </Card>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
