import { Mail } from "lucide-react";
import React from "react";

const ForgotPassword = () => {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    // In real app, send request to backend to send email
    setSubmitted(true);
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        {submitted ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Check Your Email</h2>
            <p className="text-gray-600">
              A reset password link has beed sent to <strong>{email}</strong>
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Forgot Password
            </h2>
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div className="flex gap-2 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none">
                <label htmlFor="" className="flex items-center">
                  <Mail />
                </label>
                <input
                  required
                  type="email"
                  className="w-full focus:outline-none"
                  placeholder="Enter your Registered Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Send Reset Link
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
