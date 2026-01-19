export const metadata = {
  title: "Emergency Legal Helpline Numbers in India | Citizen Help",
  description:
    "List of important legal and emergency helpline numbers in India including police, women safety, child helpline, and cybercrime support.",
};

export default function EmergencyHelplinesPage() {
  const helplines = [
    { name: "Police (All India)", number: "100" },
    { name: "Women Helpline", number: "1091 / 181" },
    { name: "Child Helpline", number: "1098" },
    { name: "Cyber Crime Helpline", number: "155260" },
    { name: "National Disaster Management", number: "108" },
    { name: "Ambulance / Emergency Medical", number: "102" },
    { name: "Senior Citizen Helpline", number: "1291" },
    { name: "Railway Enquiry / Security", number: "139" },
  ];

  return (
    <main className="bg-white px-6 py-16">
      <article className="max-w-3xl mx-auto prose prose-lg prose-headings:text-blue-900 prose-a:text-orange-600">
        <h1>Emergency Legal & Safety Helpline Numbers in India 📞</h1>

        <p>
          In any emergency, quick access to the right authorities can save lives
          and prevent legal violations. Keep these helpline numbers handy.
        </p>

        <hr />

        <h2>General Emergency Helplines</h2>
        <ul>
          {helplines.map((line) => (
            <li key={line.number}>
              <strong>{line.name}:</strong> <a href={`tel:${line.number}`}>{line.number}</a>
            </li>
          ))}
        </ul>

        <h2>Tips When Calling Helplines</h2>
        <ul>
          <li>Stay calm and clearly explain your situation.</li>
          <li>Provide accurate location details.</li>
          <li>Keep any relevant documents ready.</li>
          <li>Note the name and designation of the person you spoke with.</li>
        </ul>

        <h2>Additional Notes</h2>
        <p>
          - Women in distress can call 181, which is available 24x7.<br />
          - Children facing abuse or neglect can call 1098 for immediate assistance.<br />
          - Cybercrime victims can contact 155260 or register complaints online.
        </p>

        <hr />
        <p className="text-sm text-gray-500">
          © 2026 Sridhar Prakash – Citizen Awareness Helpline Guide
        </p>
      </article>
    </main>
  );
}
