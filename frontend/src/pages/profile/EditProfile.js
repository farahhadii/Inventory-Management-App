import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "../../components/card/Card";
import { selectUser } from "../../redux/features/auth/authSlice";
import "./EditProfile.scss";
import { toast } from "react-toastify";
import { updateUser, changePassword } from "../../services/authService";

const EditProfile = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { email } = user;

  useEffect(() => {
    if (!email) {
      navigate("/profile");
    }
  }, [email, navigate]);

  const initialProfileState = {
    name: user?.name,
    email: user?.email,
    phone: user?.phone,
    bio: user?.bio,
    photo: user?.photo,
  };

  const initialPasswordState = {
    oldPassword: "",
    password: "",
    password2: "",
  };

  const [profile, setProfile] = useState(initialProfileState);
  const [profileImage, setProfileImage] = useState(null);
  const [passwordData, setPasswordData] = useState(initialPasswordState);
  const [showModal, setShowModal] = useState(false); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfile({ ...profile, photo: URL.createObjectURL(file) });
      setShowModal(false);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    try {
      let imageURL = profile.photo;
      if (
        profileImage &&
        (profileImage.type === "image/jpeg" ||
          profileImage.type === "image/jpg" ||
          profileImage.type === "image/png")
      ) {
        const image = new FormData();
        image.append("file", profileImage);
        image.append("upload_preset", "preset1");

        // Save image to Cloudinary
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dtcp88rxz/image/upload",
          { method: "post", body: image }
        );

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const imgData = await response.json();
        imageURL = imgData.url.toString();
      }

      const formData = {
        name: profile.name,
        phone: profile.phone,
        bio: profile.bio,
        photo: profileImage ? imageURL : profile.photo,
      };

      if (passwordData.password && passwordData.password === passwordData.password2) {
        const passwordFormData = {
          oldPassword: passwordData.oldPassword,
          password: passwordData.password,
        };
        await changePassword(passwordFormData);
        toast.success("Password changed successfully");
      } else if (passwordData.password !== passwordData.password2) {
        return toast.error("New passwords do not match");
      }

      // Update User Profile
      await updateUser(formData);

      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="edit-profile --my2">
      <Card cardClass={"card --flex-dir-column"}>
        <span
          className="profile-photo"
          onClick={() => setShowModal(true)}
          style={{ cursor: "pointer" }}
        >
          <img src={profile.photo} alt="profilepic" />
        </span>
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Change Profile Picture</h3>
              <input type="file" name="image" onChange={handleImageChange} />
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        )}
        <form className="--form-control --m" onSubmit={saveProfile}>
          <span className="profile-data">
            <p>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={profile?.name}
                onChange={handleInputChange}
              />
            </p>
            <p>
              <label>Email:</label>
              <input type="text" name="email" value={profile?.email} disabled />
              <br />
              <code>Email cannot be changed.</code>
            </p>
            <p>
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={profile?.phone}
                onChange={handleInputChange}
              />
            </p>
            <p>
              <label>Bio:</label>
              <textarea
                name="bio"
                value={profile?.bio}
                onChange={handleInputChange}
                cols="30"
                rows="10"
              ></textarea>
            </p>
            <p>
              <label>Old Password:</label>
              <input
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
              />
            </p>
            <p>
              <label>New Password:</label>
              <input
                type="password"
                name="password"
                value={passwordData.password}
                onChange={handlePasswordChange}
              />
            </p>
            <p>
              <label>Confirm New Password:</label>
              <input
                type="password"
                name="password2"
                value={passwordData.password2}
                onChange={handlePasswordChange}
              />
            </p>
            <div>
              <button type="submit" className="--btn --btn-primary">
                Save Changes
              </button>
            </div>
          </span>
        </form>
      </Card>
    </div>
  );
};

export default EditProfile;