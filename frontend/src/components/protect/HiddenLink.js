import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/features/auth/authSlice";

// Creating two components where we will hide login and logout links based on the user's login status. 

export const ShowOnLogin = ({ children }) => { 
  const isLoggedIn = useSelector(selectIsLoggedIn); 

  if (isLoggedIn) {
    return <> {children}</>; 
  }
  return null;
};

export const ShowOnLogout = ({ children }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  if (!isLoggedIn) {
    return <> {children}</>;
  }
  return null;
};