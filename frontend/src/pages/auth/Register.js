import React, { useState } from 'react';
import styles from "./auth.module.scss"
import { TiUserAddOutline } from "react-icons/ti"
import Card from "../../components/card/Card"
import { Link, useNavigate } from 'react-router-dom';
import {toast} from "react-toastify";
import { validateEmail, registerUser } from '../../services/authService';
import {useDispatch} from "react-redux";
import {SET_LOGIN} from "../../redux/features/auth/authSlice";
import {SET_NAME} from "../../redux/features/auth/authSlice";

const initialState = {
    name: "", 
    email: "", 
    password: "", 
    password2:"",
};

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setformData] = useState(initialState); 
    const {name, email, password, password2} = formData

    const handleInputChange = (e) => {
        const {name, value} = e.target; 
        setformData({...formData, [name]: value});
    };

    const register = async (e) => {
        e.preventDefault();
        
        if (!name || !email || !password) {
            return toast.error("All fields are required");
        }
        if (password.length < 6) {
            return toast.error("Passwords must be up to 6 characters");
        }
        if (!validateEmail(email)) {
            return toast.error("Please enter a valid email");
        }
        if (password !== password2) {
            return toast.error("Passwords do not match");
        }
        const userData = {
            name, email, password 
        }; 
        try {
            const data = await registerUser(userData); 
            await dispatch(SET_LOGIN(true));
            await dispatch(SET_NAME(data.name));
            navigate("/dashboard")
        } catch(error) {
            console.log(error.message);
        }
    }
    return (
        <div className={`container ${styles.auth}`}>
            <Card>
                <div className={styles.form}>
                    <div className="--flex-center">
                        <TiUserAddOutline size={35} color="#999" />
                    </div>
                    <h2>Register</h2>
                    <form onSubmit={register}>
                        <input type="text" placeholder="Name" required name="name" value={name} onChange={handleInputChange} />
                        <input type="email" placeholder="Email" required name="email" value={email} onChange={handleInputChange}/>
                        <input type="password" placeholder="Password" required name="password" value={password} onChange={handleInputChange} />
                        <input type="password" placeholder="Confirm Password" required name="password2"  value={password2} onChange={handleInputChange} />
                        <button type="submit" className="--btn --btn-primary --btn-block" style={{
                                fontSize: '1.3rem',
                                padding: '0.7rem',
                                backgroundColor: '#1e3c72',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '10px',
                                width: '100%',
                                textAlign: 'center',
                                cursor: 'pointer',
                                display: 'inline-block',
                                transition: 'background-color 0.3s ease',
                                textTransform: 'none'  
                            }}>Register</button>
                    </form>
                    <div className={styles.links}>
                        <Link to="/">Home</Link>
                    </div>
                    <div className={styles.register}>
                        <p>Already have an account?</p>
                        <Link to="/login">Login</Link>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Register;