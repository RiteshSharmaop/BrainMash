import React, { useContext, useEffect , useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../Components/Loading";
import { UserDataContext } from "../context/UserContext"

function UserProtectedWrapper({ children }) {
  const navigate = useNavigate();
  // const token = localStorage.getItem("token");
  const { user, setUser } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(true);

  const { token } = useContext(UserDataContext);


  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);


  axios.get("http://localhost:8000/api/user/me", {
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
