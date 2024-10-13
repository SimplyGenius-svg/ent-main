// Example: calculateMatchScore function
export const calculateMatchScore = (currentUserProfile, matchProfile) => {
  // Ensure the fields are defined or use empty arrays/strings
  const currentUserExpertise = currentUserProfile.expertise || [];
  const matchExpertise = matchProfile.expertise || [];

  const currentUserIndustry = currentUserProfile.industry || '';
  const matchIndustry = matchProfile.industry || '';

  const currentUserGoals = currentUserProfile.goals || '';
  const matchGoals = matchProfile.goals || '';

  let score = 0;

  // Match expertise (compare arrays safely)
  if (matchExpertise.some((skill) => currentUserExpertise.includes(skill))) {
    score += 30; // Add points if they share expertise
  }

  // Match industry (compare strings safely)
  if (currentUserIndustry === matchIndustry) {
    score += 20;
  }

  // Match goals (compare strings safely)
  if (currentUserGoals === matchGoals) {
    score += 50;
  }

  return score; // Return the calculated score
};
