import { Header } from '../../components/Header';

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-4">Help & FAQ</h1>
          <div className="space-y-4">
            <section>
              <h2 className="text-2xl font-semibold mb-2">How to use One Caller OTP</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Select your country code from the dropdown menu.</li>
                <li>Enter the phone number you want to call.</li>
                <li>Click the &quot;Call User&quot; button to initiate the call.</li>
                <li>Wait for the call status updates.</li>
                <li>If successful, the OTP entered by the user will be displayed.</li>
              </ol>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-2">Troubleshooting</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Ensure you have entered the correct phone number.</li>
                <li>Check that you have selected the correct country code.</li>
                <li>If the call fails, try again after a few minutes.</li>
                <li>For persistent issues, contact our support team.</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 One Caller OTP System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
