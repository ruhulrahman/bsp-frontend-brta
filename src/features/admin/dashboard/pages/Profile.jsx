import React from "react";
// import { Button } from "react-bootstrap";

// useEffect(() => {
//   getUserProfilePhoto()
// },[])

// const getUserProfilePhoto = async () => {

//   try {
//       const { data } = await RestApi.get(`api/v1/admin/user-management/user/get-profile-photo`,{
//           responseType: "text", // Use "arraybuffer" for PDFs and "text" for Base64
//       })
//       const userPhoto = `data:image/jpeg;base64,${data}`
//       setUserUploadImage(userPhoto)
//   } catch (error) {
//       console.log('error', error)
//   }
// }

const Profile = () => {
  return (
    <div className="container-fluid p-2">
      <h1>Profile</h1>
      <p>Your main content goes here.</p>
    </div>
  );
};

export default Profile;
