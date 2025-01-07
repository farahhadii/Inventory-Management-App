import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Card from "../../components/card/Card";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { SET_NAME, SET_USER } from "../../redux/features/auth/authSlice";
import { getUser } from "../../services/authService";
import "./Profile.scss";

const Profile = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function getUserData() {
      const data = await getUser();
      setProfile(data);
      await dispatch(SET_USER(data));
      await dispatch(SET_NAME(data.name));
    }
    getUserData();
  }, [dispatch]);

  return (
    <div className="profile --my2">
      <>
        {profile === null ? (
          <p>Something went wrong, please reload the page...</p>
        ) : (
          <Card cardClass={"card --flex-dir-column"}>
            <div className="profile-photo">
              <img src={profile?.photo} alt="profilepic" />
            </div>
            <div className="profile-data">
              <p>
                <b>Name: </b> {profile?.name}
              </p>
              <p>
                <b>Email: </b> {profile?.email}
              </p>
              <p>
                <b>Phone: </b> {profile?.phone}
              </p>
              <p>
                <b>Bio: </b> {profile?.bio}
              </p>
              <div>
                <Link to="/edit-profile">
                  <button className="--btn --btn-primary">Edit Profile</button>
                </Link>
              </div>
            </div>
          </Card>
        )}
      </>
    </div>
  );
};

export default Profile;