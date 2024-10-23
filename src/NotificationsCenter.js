import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "./actions/firebase";

const NotificationsCenter = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Fetch pending requests sent to the current user
        const q = query(
          collection(db, "connections"),
          where("to", "==", auth.currentUser.uid),
          where("status", "==", "pending")
        );
        const querySnapshot = await getDocs(q);

        // Fetch each user's name based on their UID
        const notificationsList = await Promise.all(
          querySnapshot.docs.map(async (docSnapshot) => {
            const notificationData = docSnapshot.data();
            const userDocRef = doc(db, "users", notificationData.from); // Assuming "from" is the UID of the sender
            const userSnapshot = await getDoc(userDocRef);
            const fromUserName = userSnapshot.exists()
              ? userSnapshot.data().displayName
              : notificationData.from; // Fallback to UID

            return {
              id: docSnapshot.id,
              ...notificationData,
              fromUserName, // Attach the display name instead of just the UID
            };
          })
        );

        setNotifications(notificationsList);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    // Real-time listener to update notifications when the request is accepted
    const subscribeToNotifications = () => {
      const q = query(
        collection(db, "connections"),
        where("from", "==", auth.currentUser.uid), // Current user is the sender
        where("status", "==", "accepted") // Only listen to accepted requests
      );

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const acceptedNotifications = await Promise.all(
          snapshot.docs.map(async (docSnapshot) => {
            const notificationData = docSnapshot.data();
            const toUserDocRef = doc(db, "users", notificationData.to); // Assuming "to" is the UID of the recipient
            const userSnapshot = await getDoc(toUserDocRef);
            const toUserName = userSnapshot.exists()
              ? userSnapshot.data().displayName
              : notificationData.to; // Fallback to UID

            return {
              id: docSnapshot.id,
              ...notificationData,
              toUserName, // Attach the recipient's name for display
            };
          })
        );

        setNotifications((prevNotifications) => [
          ...prevNotifications,
          ...acceptedNotifications,
        ]);
      });

      return unsubscribe;
    };

    fetchNotifications();
    const unsubscribeAcceptedNotifications = subscribeToNotifications(); // Subscribe to accepted notifications

    // Cleanup on component unmount
    return () => {
      unsubscribeAcceptedNotifications();
    };
  }, []);

  const handleSendRequest = async (recipientId) => {
    try {
      // Check if a connection request already exists between the users (from both directions)
      const q = query(
        collection(db, "connections"),
        where("status", "in", ["pending", "accepted"]), // Check for both pending and accepted requests
        where(
          "from",
          "in",
          [auth.currentUser.uid, recipientId] // Check if the current user or recipient has already sent a request
        ),
        where(
          "to",
          "in",
          [auth.currentUser.uid, recipientId] // Check if the current user or recipient is the receiver
        )
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert(
          "A connection request already exists between you and this person."
        );
        return; // Prevent sending a new request
      }

      // If no existing request, proceed with sending the new connection request
      await addDoc(collection(db, "connections"), {
        from: auth.currentUser.uid,
        to: recipientId,
        status: "pending",
        timestamp: new Date(),
      });

      alert("Connection request sent!");
    } catch (error) {
      console.error("Error sending connection request:", error);
    }
  };

  // Handle accepting a connection request
  const handleAcceptRequest = async (notification) => {
    const notificationId = notification.id;

    try {
      const notificationDocRef = doc(db, "connections", notificationId);
      await updateDoc(notificationDocRef, {
        status: "accepted",
      });

      // Notify the sender that their connection request was accepted
      await addDoc(collection(db, "notifications"), {
        to: notification.from, // Send notification to the sender
        message: `${auth.currentUser.displayName} has accepted your connection request.`,
        type: "connection-accepted",
        status: "unread",
        timestamp: new Date(),
      });

      alert("Connection request accepted!");
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification.id !== notificationId
        )
      );
    } catch (error) {
      console.error("Error accepting connection request:", error);
    }
  };

  // Handle rejecting a connection request
  const handleRejectRequest = async (notificationId) => {
    try {
      const notificationDocRef = doc(db, "connections", notificationId);
      await updateDoc(notificationDocRef, {
        status: "rejected",
      });
      alert("Connection request rejected.");
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification.id !== notificationId
        )
      );
    } catch (error) {
      console.error("Error rejecting connection request:", error);
    }
  };

  return (
    <div>
      <h3>Notifications</h3>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>
            {notification.fromUserName} sent you a connection request.{" "}
            {/* Display the sender's name */}
            <button onClick={() => handleAcceptRequest(notification)}>
              Accept
            </button>
            <button onClick={() => handleRejectRequest(notification.id)}>
              Reject
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsCenter;
