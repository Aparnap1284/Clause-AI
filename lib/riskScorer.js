// Simple rule-based + keyword-based risk scoring

export function calculateRiskScore(text) {
  let score = 0;

  if (text.toLowerCase().includes("penalty") || text.toLowerCase().includes("termination")) {
    score += 3;
  }
  if (text.toLowerCase().includes("deposit") || text.toLowerCase().includes("security deposit")) {
    score += 2;
  }
  if (text.toLowerCase().includes("repair")) {
    score += 1;
  }
  if (text.toLowerCase().includes("automatic renewal") || text.toLowerCase().includes("renewal")) {
    score += 2;
  }

  if (score >= 6) return "High";
  if (score >= 3) return "Medium";
  return "Low";
}
