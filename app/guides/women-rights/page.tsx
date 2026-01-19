export const metadata = {
  title: "Women's Rights During Arrest & Custody | Citizen Help",
  description:
    "Know your legal rights as a woman in India during arrest or police custody. Learn what authorities can and cannot do, and how to seek legal help.",
};

export default function WomenRightsPage() {
  const rights = [
    "Right to be informed of the reason for arrest immediately.",
    "Right to consult a lawyer of your choice.",
    "Right to have a female police officer present during questioning or search.",
    "Right against being detained in solitary confinement.",
    "Right to medical attention if required.",
    "Right to communicate with family members or friends.",
    "Right to be treated with dignity and respect at all times.",
    "Right to file a complaint in case of harassment or misconduct by authorities.",
  ];

  return (
    <main className="bg-white px-6 py-16">
      <article className="max-w-3xl mx-auto prose prose-lg prose-headings:text-blue-900 prose-a:text-orange-600">
        <h1>Women&apos;s Rights During Arrest & Custody 🚨</h1>


        <p>
          Being aware of your legal rights is essential for protection and safety. 
          These rights are guaranteed under Indian law to ensure that women are treated fairly and with dignity in all interactions with law enforcement.
        </p>

        <hr />

        <h2>Key Rights</h2>
        <ul>
          {rights.map((right, idx) => (
            <li key={idx}>{right}</li>
          ))}
        </ul>

        <h2>Important Tips</h2>
        <ul>
          <li>Always remain calm and composed.</li>
          <li>Clearly state your rights if you feel they are being violated.</li>
          <li>Request the presence of a female officer during questioning or search.</li>
          <li>Keep emergency contacts handy and notify them if detained.</li>
          <li>Seek legal help immediately if necessary.</li>
        </ul>

        <h2>Resources</h2>
        <p>
          - National Commission for Women (NCW) Helpline: <a href="tel:1091">1091</a><br />
          - Women Helpline (All India): <a href="tel:181">181</a><br />
          - Legal Aid Services: Contact your local District Legal Services Authority (DLSA)
        </p>

        <hr />
        <p className="text-sm text-gray-500">
          © 2026 Sridhar Prakash – Citizen Awareness Guide
        </p>
      </article>
    </main>
  );
}
