import React, { useContext, useEffect , useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../Components/Loading";

function UserProtectedWrapper({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { user, setUser } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);


  axios.get(`${import.meta.env.VITE_BASE_URL}/users/current-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      // console.log(response)
      if (response.status === 201) {
        setUser(response.data.data.user);
        setIsLoading(false);
      }
    })
    .catch((error) => {
      // console.log(error);
      localStorage.removeItem("token");
      navigate("/login");
    });

  if (isLoading) {
    // return <h1>Loadadadadading...</h1>;
    return <Loading/>;
  }

  return (
      <>
        {children}
      </>
  )
}

export default UserProtectedWrapper;
