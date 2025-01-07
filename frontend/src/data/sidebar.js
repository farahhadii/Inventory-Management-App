import { FaTh, FaRegChartBar, FaListUl } from "react-icons/fa";
import { BiImageAdd } from "react-icons/bi"; 

const menu = [
  {
    title: "Dashboard",
    icon: <FaTh />,
    path: "/dashboard",
  },
  {
    title: "Add Product",
    icon: <BiImageAdd style={{ fontSize: "1.3em" }} />,
    path: "/add-product",
  },
  {
    title: "View Products",
    icon:  <FaListUl />, 
    path: "/product-detail", 
  },
  {
    title: "Account",
    icon: <FaRegChartBar />,
    childrens: [
      {
        title: "Profile",
        path: "/profile",
      },
      {
        title: "Edit Profile",
        path: "/edit-profile",
      },
    ],
  }
];

export default menu; 
