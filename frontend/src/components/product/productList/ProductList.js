import React, { useEffect, useState, useMemo } from "react";
import "./productList.scss";
import { MdEdit, MdDelete } from "react-icons/md";
import Search from "../../search/Search";
import { useDispatch, useSelector } from "react-redux";
import {
  FILTER_PRODUCTS,
  selectFilteredProducts,
} from "../../../redux/features/product/filterSlice";
import ReactPaginate from "react-paginate";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { deleteProduct, getProducts } from "../../../redux/features/product/productSlice";
import { Link } from "react-router-dom";

const ProductList = ({ products }) => {
  const [search, setSearch] = useState("");
  const filteredProducts = useSelector(selectFilteredProducts);
  const dispatch = useDispatch();

  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;

  const shortenText = (text, n) =>
    text.length > n ? text.substring(0, n).concat("...") : text;

  const updatePagination = () => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(sortedProducts.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(sortedProducts.length / itemsPerPage));
  };

  const delProduct = async (id) => {
    await dispatch(deleteProduct(id));
    dispatch(getProducts());
    const remainingItems = sortedProducts.length - 1;
    if (remainingItems <= itemOffset) {
      const newOffset = Math.max(0, itemOffset - itemsPerPage);
      setItemOffset(newOffset);
    }
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete Product",
      message: "Are you sure you want to delete this product?",
      buttons: [
        { label: "Delete", onClick: () => delProduct(id) },
        { label: "Cancel" },
      ],
    });
  };

  const sortedProducts = useMemo(() => {
    if (filteredProducts.length === 0) return [];
    return [...filteredProducts].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : 0;
      const dateB = b.createdAt ? new Date(b.createdAt) : 0;
      return dateA - dateB;
    });
  }, [filteredProducts]);

  useEffect(updatePagination, [itemOffset, itemsPerPage, sortedProducts]);

  useEffect(() => {
    dispatch(FILTER_PRODUCTS({ products, search }));
  }, [products, search, dispatch]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % sortedProducts.length;
    setItemOffset(newOffset);
  };

  return (
    <div className="product-list">
      <hr />
      <div className="table-header">
        <h3>Inventory Items</h3>
        <Search value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="table">
        {sortedProducts.length === 0 ? (
          <p>-- No product found, please add a product...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((product, index) => {
                const { _id, name, category, price, quantity } = product;
                const serialNumber = itemOffset + index + 1;
                return (
                  <tr key={_id}>
                    <td data-label="#">{serialNumber}</td>
                    <td data-label="Name">{shortenText(name, 16)}</td>
                    <td data-label="Category">{category}</td>
                    <td data-label="Price">${price}</td>
                    <td data-label="Quantity">{quantity}</td>
                    <td data-label="Total Amount">${price * quantity}</td>
                    <td data-label="Action" className="icons">
                      <Link to={`/edit-product/${_id}`}>
                        <MdEdit
                          size={20}
                          color={"#32963d"}
                          aria-label="Edit Product"
                        />
                      </Link>
                      <MdDelete
                        size={20}
                        color={"#c41849"}
                        aria-label="Delete Product"
                        onClick={() => confirmDelete(_id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <ReactPaginate
        breakLabel="..."
        nextLabel="Next"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="Prev"
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        pageLinkClassName="page-num"
        previousLinkClassName="page-num"
        nextLinkClassName="page-num"
        activeLinkClassName="activePage"
      />
    </div>
  );
};

export default ProductList;
