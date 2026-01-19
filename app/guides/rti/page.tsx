export const metadata = {
  title: "How to File an RTI in India – Citizen Guide",
  description:
    "Step-by-step guide on how to file an RTI application in India, fees, format, online and offline process, and appeal procedure.",
};

export default function RTIGuidePage() {
  return (
    <main className="bg-white px-6 py-16">
      <article className="max-w-3xl mx-auto prose prose-lg prose-headings:text-blue-900 prose-a:text-orange-600">
        <h1>How to File an RTI in India 📄</h1>

        <p>
          The <strong>Right to Information (RTI) Act, 2005</strong> empowers every
          Indian citizen to seek information from government authorities.
        </p>

        <hr />

        <h2>Who Can File an RTI?</h2>
        <ul>
          <li>Any Indian citizen</li>
          <li>No reason required</li>
          <li>No age restriction</li>
        </ul>

        <h2>What Information Can Be Asked?</h2>
        <ul>
          <li>Government records & documents</li>
          <li>File notings</li>
          <li>Status of applications</li>
          <li>Public fund usage</li>
        </ul>

        <p>❌ Personal opinions, assumptions, or private data cannot be asked.</p>

        <h2>Step 1: Identify the Public Authority</h2>
        <p>
          Find the department holding the information (Municipality, Police,
          Ministry, PSU, etc.).
        </p>

        <h2>Step 2: Write the RTI Application</h2>
        <p>An RTI must be:</p>
        <ul>
          <li>Clear and specific</li>
          <li>Limited to facts</li>
          <li>Written in English, Hindi, or local language</li>
        </ul>

        <h3>Sample RTI Format ✍️</h3>
        <pre>
{`To  
The Public Information Officer (PIO)  
[Department Name]  
[Office Address]

Subject: Request for information under RTI Act, 2005

1. Please provide certified copies of __________.
2. Please inform the current status of __________.
3. Provide details of action taken on __________.

Applicant Name:  
Address:  
Date:  
Signature`}
        </pre>

        <h2>Step 3: Pay RTI Fee 💰</h2>
        <ul>
          <li>₹10 application fee</li>
          <li>BPL applicants: FREE</li>
          <li>Mode: Online / IPO / DD / Cash (varies by department)</li>
        </ul>

        <h2>Step 4: Submit RTI</h2>

        <h3>📌 Online RTI</h3>
        <p>
          File RTI online via the Government of India RTI portal:
        </p>
        <p>
          👉 <a href="https://rtionline.gov.in" target="_blank">https://rtionline.gov.in</a>
        </p>

        <h3>📌 Offline RTI</h3>
        <ul>
          <li>Submit by post or in person</li>
          <li>Address it to the PIO</li>
          <li>Attach fee proof</li>
        </ul>

        <h2>Time Limit for Response ⏳</h2>
        <ul>
          <li>30 days – Normal cases</li>
          <li>48 hours – Life & liberty matters</li>
        </ul>

        <h2>If No Reply or Unsatisfactory Reply ❌</h2>

        <h3>First Appeal</h3>
        <p>
          File within <strong>30 days</strong> to the First Appellate Authority
          (FAA).
        </p>

        <h3>Second Appeal</h3>
        <p>
          File to the <strong>Information Commission</strong> within 90 days.
        </p>

        <h2>Important Tips ⚠️</h2>
        <ul>
          <li>Ask one subject per RTI</li>
          <li>Do not frame questions</li>
          <li>Ask for certified copies</li>
          <li>Keep acknowledgment safely</li>
        </ul>

        <h2>RTI Is a Powerful Tool 💪</h2>
        <p>
          RTI has helped citizens expose corruption, delays, and misuse of public
          funds. Use it responsibly.
        </p>

        <hr />

        <p className="text-sm text-gray-500">
          © 2026 Sridhar Prakash – Citizen Awareness Initiative
        </p>
      </article>
    </main>
  );
}
