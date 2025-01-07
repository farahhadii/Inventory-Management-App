import React, { useState } from "react";
import styles from "./auth.module.scss";
import { AiOutlineMail } from "react-icons/ai";
import Card from "../../components/card/Card";
import { Link } from "react-router-dom";
import { forgotPassword, validateEmail } from "../../services/authService";
import { toast } from "react-toastify";


// Create Forgot Component 
const Forgot = () => {
    const [email, setEmail] = useState(""); 

    const forgot = async (e) => {
        e.preventDefault();
        if (!email) {
            return toast.error("Please enter your email");
        }

        if (!validateEmail(email)) {
            return toast.error("Please enter a valid email");
        }

        const userData = {
            email
        };

        await forgotPassword(userData); // the function is called with userData to initiate the password reset process 
        setEmail(""); 
    };

    return (
        <div className={`container ${styles.auth}`}>
            <Card>
                <div className={styles.form}>
                    <div className="--flex-center">
                        <AiOutlineMail size={35} color="#999" />
                    </div>
                    <h2>Forgot Password</h2>
                    <form onSubmit={forgot}>
                        <input type="email" placeholder="Email" required name="email" value={email} onChange={(e) => setEmail(e.target.value)} /> 
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
                            }}>Get Reset Email</button>
                        <div className={styles.links}>
                            <p>
                                <Link to="/">- Home</Link>
                            </p>
                            <p>
                                <Link to="/login">- Login</Link>
                            </p>
                    </div>
                    </form>
                </div>
            </Card>
        </div>
    );
};

export default Forgot;