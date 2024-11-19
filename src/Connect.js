import React, { useEffect, useState } from 'react';
import TinderCard from 'react-tinder-card';
import { db, auth } from './firebase';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import './styles/Connect.css';

const Connect = () => {
  const [profiles, setProfiles] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch profiles from Firestore
  useEffect(() => {
    const fetchProfiles = async () => {
      const profilesCollection = await getDocs(collection(db, 'profiles'));
      const profilesData = profilesCollection.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(profile => profile.uid !== auth.currentUser.uid); // Exclude the current user
      setProfiles(profilesData);
    };

    const fetchCurrentUser = async () => {
      const userDoc = await getDoc(doc(db, 'profiles', auth.currentUser.uid));
      if (userDoc.exists()) {
        setCurrentUser(userDoc.data());
      }
    };

    fetchProfiles();
    fetchCurrentUser();
  }, []);

  // Handle swipes for liking or passing on a profile
  const onSwipe = async (direction, swipedProfile) => {
    if (direction === 'right') {
      // Like action
      await setDoc(doc(db, 'likes', `${auth.currentUser.uid}_${swipedProfile.uid}`), {
        from: auth.currentUser.uid,
        to: swipedProfile.uid,
      });

      // Check for a match
      const reciprocalLikeDoc = await getDoc(doc(db, 'likes', `${swipedProfile.uid}_${auth.currentUser.uid}`));
      if (reciprocalLikeDoc.exists()) {
        // Match found, store in the 'matches' collection
        const matchId = [auth.currentUser.uid, swipedProfile.uid].sort().join('_');
        await setDoc(doc(db, 'matches', matchId), {
          users: [auth.currentUser.uid, swipedProfile.uid],
          createdAt: new Date(),
        });
        alert(`You matched with ${swipedProfile.name}!`);
      }
    }
  };

  // Out of cards message
  if (profiles.length === 0) {
    return <div className="out-of-cards">No more profiles to show</div>;
  }

  return (
    <div className="connect-container">
      {profiles.map((profile) => (
        <TinderCard
          key={profile.id}
          onSwipe={(dir) => onSwipe(dir, profile)}
          preventSwipe={['up', 'down']}
        >
          <div className="profile-card">
            <img src={profile.profilePic || 'default-profile.png'} alt={profile.name} className="profile-pic" />
            <h3>{profile.name}</h3>
            <p>{profile.description}</p>
            {profile.video && (
              <video controls src={profile.video} width="100%" />
            )}
          </div>
        </TinderCard>
      ))}
    </div>
  );
};

export default Connect;
