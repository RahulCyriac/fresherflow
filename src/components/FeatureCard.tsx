type FeatureCardProps = {
  title: string;
};

export default function FeatureCard({ title }: FeatureCardProps) {
  return (
    <div className="border border-gray-700 bg-gray-900 text-white rounded-lg p-4">
      <h3 className="font-semibold">{title}</h3>
    </div>
  );
}