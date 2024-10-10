import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { ref as storageRef, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { db, auth, storage } from './firebase';
import './styles/ConnectProfile.css';
import { FaVideo, FaImage, FaSave } from 'react-icons/fa';

const ConnectProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    elevatorPitch: '',
    profileVideo: null,
    profilePic: null,
    pictures: [],
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoFile, setVideoFile] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [picturesFiles, setPicturesFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/signin');
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userSnapshot = await getDoc(userDocRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUser(userData);
          setFormData({ ...userData });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Check if user has created a profile video and redirect based on that
  const handleConnectClick = async () => {
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();

        // If profileVideo exists, redirect to ConnectSwipe
        if (userData.profileVideo) {
          navigate('/connectswipe');
        } else {
          // If not, redirect to BuildProfile
          navigate('/build-profile');
        }
      } else {
        // If no user document is found, go to BuildProfile
        console.error('User document not found');
        navigate('/build-profile');
      }
    } catch (error) {
      console.error('Error checking profile status:', error);
      // Redirect to BuildProfile as a fallback
      navigate('/build-profile');
    }
  };

  const handleProfilePicChange = (e) => {
    setProfilePicFile(e.target.files[0]);
  };

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handlePicturesChange = (e) => {
    setPicturesFiles([...e.target.files]);
  };

  const handleSaveChanges = async () => {
    try {
      let profilePicUrl = formData.profilePic;
      if (profilePicFile) {
        const storageRefInstance = storageRef(storage, `profilePictures/${auth.currentUser.uid}`);
        const uploadTask = uploadBytesResumable(storageRefInstance, profilePicFile);

        await new Promise((resolve, reject) => {
          uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          }, (error) => {
            console.error('Profile picture upload error:', error);
            reject(error);
          }, async () => {
            profilePicUrl = await getDownloadURL(uploadTask.snapshot.ref);
            setFormData((prevData) => ({ ...prevData, profilePic: profilePicUrl }));
            resolve();
          });
        });
      }

      let profileVideoUrl = formData.profileVideo;
      if (videoFile) {
        const videoRefInstance = storageRef(storage, `profileVideos/${auth.currentUser.uid}`);
        const uploadTask = uploadBytesResumable(videoRefInstance, videoFile);

        await new Promise((resolve, reject) => {
          uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          }, (error) => {
            console.error('Profile video upload error:', error);
            reject(error);
          }, async () => {
            profileVideoUrl = await getDownloadURL(uploadTask.snapshot.ref);
            setFormData((prevData) => ({ ...prevData, profileVideo: profileVideoUrl }));
            resolve();
          });
        });
      }

      const picturesUrls = [];
      for (const file of picturesFiles) {
        const pictureRefInstance = storageRef(storage, `profilePictures/${auth.currentUser.uid}/${file.name}`);
        const uploadTask = uploadBytesResumable(pictureRefInstance, file);

        await new Promise((resolve, reject) => {
          uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          }, (error) => {
            console.error('Picture upload error:', error);
            reject(error);
          }, async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            picturesUrls.push(downloadURL);
            resolve();
          });
        });
      }

      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, { ...formData, profilePic: profilePicUrl, profileVideo: profileVideoUrl, pictures: picturesUrls });
      
      console.log("Profile saved successfully.");

      // After saving, check if the user already has a profile and redirect accordingly
      handleConnectClick();
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="connect-profile-container">
      <div className="connect-profile-form">
        <h2>Build Your Connection Profile</h2>
        <label>Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
        <label>Elevator Pitch (30 seconds max)</label>
        <textarea name="elevatorPitch" value={formData.elevatorPitch} onChange={handleChange} rows="4" />
        <label>Profile Video</label>
        <input type="file" accept="video/*" onChange={handleVideoChange} />
        {videoFile && (
          <video src={URL.createObjectURL(videoFile)} controls className="preview-video" />
        )}
        <label>Profile Picture</label>
        <input type="file" accept="image/*" onChange={handleProfilePicChange} />
        {profilePicFile && (
          <img src={URL.createObjectURL(profilePicFile)} alt="Profile Preview" className="preview-image" />
        )}
        <label>Additional Pictures</label>
        <input type="file" accept="image/*" multiple onChange={handlePicturesChange} />
        <div className="preview-pictures">
          {picturesFiles.map((file, index) => (
            <img key={index} src={URL.createObjectURL(file)} alt="Additional Preview" className="preview-image-small" />
          ))}
        </div>
        <button className="save-button" onClick={handleSaveChanges}><FaSave /> Save Profile</button>
      </div>
    </div>
  );
};

export default ConnectProfile;
