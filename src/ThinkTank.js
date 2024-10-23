import React, { useState, useEffect } from "react";
import { db, auth, storage } from "./actions/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref as storageRef,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./styles/ThinkTank.css"; // Ensure this CSS file exists

const ThinkTank = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch posts from Firebase
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(
          collection(db, "thinkTankPosts"),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        const postsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsArray);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // Handle image upload
  const handleImageUpload = async () => {
    if (imageFile) {
      const imageName = `${auth.currentUser.uid}_${Date.now()}_${
        imageFile.name
      }`;
      const storageReference = storageRef(
        storage,
        `thinkTankImages/${imageName}`
      );
      const uploadTask = uploadBytesResumable(storageReference, imageFile);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.error("Error uploading image:", error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    }
    return null;
  };

  // Handle post submission
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || newPost.length > 150) return;

    setLoading(true);

    try {
      const imageUrl = await handleImageUpload();
      const postData = {
        text: newPost.trim(),
        imageUrl: imageUrl || "",
        user: {
          displayName: auth.currentUser.displayName,
          uid: auth.currentUser.uid,
          profilePic: auth.currentUser.photoURL || "default-profile.png",
        },
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, "thinkTankPosts"), postData);
      setNewPost("");
      setImageFile(null);

      // Refresh posts
      const q = query(
        collection(db, "thinkTankPosts"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      const postsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsArray);
    } catch (error) {
      console.error("Error adding post:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle user profile redirection
  const handleProfileClick = (uid) => {
    navigate(`/profile/${uid}`);
  };

  // Handle Connect button
  const handleConnect = async (uid) => {
    if (uid === auth.currentUser.uid) {
      alert("You can't connect with yourself.");
      return;
    }

    try {
      const connectionRef = collection(db, "connections");
      await addDoc(connectionRef, {
        from: auth.currentUser.uid,
        to: uid,
        status: "pending",
        timestamp: serverTimestamp(),
      });
      alert("Connection request sent!");
    } catch (error) {
      console.error("Error sending connection request:", error);
    }
  };

  return (
    <div className="thinktank-container">
      <h1>ThinkTank</h1>

      {/* Post Creation */}
      <form onSubmit={handlePostSubmit} className="new-post-form">
        <textarea
          placeholder="What's on your mind? (150 characters max)"
          maxLength="150"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </button>
      </form>

      {/* Post Feed */}
      <div className="posts-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post">
              <div className="post-header">
                <img
                  src={post.user.profilePic || "default-profile.png"}
                  alt="Profile"
                  className="profile-pic"
                  onClick={() => handleProfileClick(post.user.uid)}
                />
                <h3
                  onClick={() => handleProfileClick(post.user.uid)}
                  className="username"
                >
                  {post.user.displayName}
                </h3>
                <span className="timestamp">
                  {post.timestamp?.toDate().toLocaleString() || "Just now"}
                </span>
              </div>
              <p className="post-text">{post.text}</p>
              {post.imageUrl && (
                <img src={post.imageUrl} alt="Post" className="post-image" />
              )}
              <button
                className="connect-btn"
                onClick={() => handleConnect(post.user.uid)}
              >
                Connect
              </button>
            </div>
          ))
        ) : (
          <p>No posts yet. Be the first to post!</p>
        )}
      </div>
    </div>
  );
};

export default ThinkTank;
