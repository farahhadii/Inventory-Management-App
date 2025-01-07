import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductList from "../../components/product/productList/ProductList";
import ProductSummary from "../../components/product/productSummary/ProductSummary";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { selectIsLoggedIn } from "../../redux/features/auth/authSlice";
import { getProducts, resetProductState } from "../../redux/features/product/productSlice";

const Dashboard = () => {
  useRedirectLoggedOutUser("/login");

  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { products, isError, message, hasFetched } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(resetProductState());
    }
  }, [isLoggedIn, dispatch]);

  // Fetch products only if logged in and not already fetched
  useEffect(() => {
    if (isLoggedIn && !hasFetched) {
      dispatch(getProducts());
    }
  }, [isLoggedIn, hasFetched, dispatch]);
  
  useEffect(() => {
    if (isError) {
      console.error("Error fetching products:", message);
    }
  }, [isError, message]);

  return (
    <div>
      <ProductSummary products={products} />
      <ProductList products={products} />
    </div>
  );
};

export default Dashboard;


