export default function FeatureCard({ title, description }) {
  return (
    <div className="card">
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
}
