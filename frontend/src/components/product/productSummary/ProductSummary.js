import React, { useEffect } from "react";
import "./ProductSummary.scss";
import { AiFillDollarCircle } from "react-icons/ai";
import { BsCart4 } from "react-icons/bs";
import { BiCategory } from "react-icons/bi";
import InfoBox from "../../infoBox/InfoBox";
import {useDispatch, useSelector } from "react-redux";
import {CALC_CATEGORY, CALC_STORE_VALUE, selectCategory,selectTotalStoreValue} from "../../../redux/features/product/productSlice";
/* The ProductSummary component displays inventory statistics, such as the total number of products, total store value, out-of-stock items, and categories, 
using data from the Redux store
*/ 

const earningIcon = <AiFillDollarCircle size={40} color="#b624ff" />;
const productIcon = <BsCart4 size={40} color="#32963d" />;
const categoryIcon = <BiCategory size={40} color="#03a5fc" />;

export const formatNumbers = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
const ProductSummary = ({ products }) => {
  const dispatch = useDispatch();
  const totalStoreValue = useSelector(selectTotalStoreValue); // gets the state of the totalStoreValue from productSlice.js 
  const category = useSelector(selectCategory); 
  
  useEffect(() => {
    dispatch(CALC_STORE_VALUE(products)); 
    dispatch(CALC_CATEGORY(products));
  }, [dispatch, products]);
  return (
    <div className="product-summary">
      <h3 className="--mt">Inventory Stats</h3>
      <div className="info-summary">
        <InfoBox
          icon={productIcon}
          title={"Total Products"}
          count={products.length}
          bgColor="card1"
        />
        <InfoBox
          icon={earningIcon}
          title={"Total Store Value"}
          count={`$${formatNumbers(totalStoreValue.toFixed(2))}  `}
          bgColor="card2"
        />
        <InfoBox
          icon={categoryIcon}
          title={"All Categories"}
          count={category.length}
          bgColor="card4"
        />
      </div>
    </div>
    )}

export default ProductSummary;