import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './styles/MentorHub.css';

const MentorHub = () => {
  const [mentors, setMentors] = useState([]);
  const [goals, setGoals] = useState([{ text: 'Increase Product-Market Fit', completed: false }]);

  useEffect(() => {
    const fetchMentors = async () => {
      const mentorsCollection = collection(db, 'mentors');
      const mentorsSnapshot = await getDocs(mentorsCollection);
      const mentorsList = mentorsSnapshot.docs.map((doc) => doc.data());
      setMentors(mentorsList);
    };

    fetchMentors();
  }, []);

  const addGoal = (goalText) => {
    setGoals([...goals, { text: goalText, completed: false }]);
  };

  const toggleGoalComplete = (index) => {
    const newGoals = [...goals];
    newGoals[index].completed = !newGoals[index].completed;
    setGoals(newGoals);
  };

  return (
    <div className="mentor-hub">
      <h1 className="hub-title">Mentor Hub</h1>

      <div className="resource-section">
        <h2>Mentor Resources</h2>
        <ul className="resources-list">
          <li><a href="https://mentorloop.com/blog/the-mentoring-handbook/" target="_blank" rel="noopener noreferrer">The Mentorship Handbook</a></li>
          <li><a href="https://www.ycombinator.com/library/4s-growth-tactics" target="_blank" rel="noopener noreferrer">Growth Tactics for Early Startups</a></li>
          <li><a href="https://medium.com/swlh/10-ways-to-lead-founders" target="_blank" rel="noopener noreferrer">How to Lead Founders Effectively</a></li>
        </ul>
      </div>

      <div className="goal-tracker">
        <h2>Goal Tracker</h2>
        <ul className="goals-list">
          {goals.map((goal, index) => (
            <li key={index} className={`goal-item ${goal.completed ? 'completed' : ''}`} onClick={() => toggleGoalComplete(index)}>
              {goal.text}
            </li>
          ))}
        </ul>
        <button className="add-goal-button" onClick={() => addGoal(prompt('Enter new goal:'))}>Add New Goal</button>
      </div>

      <div className="mentor-list">
        <h2>Available Mentors</h2>
        <div className="mentor-cards">
          {mentors.length > 0 ? (
            mentors.map((mentor, index) => (
              <div key={index} className="mentor-card">
                <h3>{mentor.name}</h3>
                <p>Expertise: {mentor.expertise}</p>
                <p>Industries: {mentor.industries.join(', ')}</p>
                <p>Past Mentees: {mentor.pastMentees.join(', ')}</p>
              </div>
            ))
          ) : (
            <p>No mentors available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorHub;
