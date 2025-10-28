import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900 relative overflow-hidden">
      {/* Animated blurred background shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-indigo-800/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-pink-900/40 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-1/4 h-1/4 bg-purple-800/30 rounded-full blur-2xl animate-pulse"></div>
      </div>

      {/* Clerk SignUp */}
      <div className="relative w-full max-w-md z-10">
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-white shadow-2xl border border-indigo-200 rounded-2xl p-6 w-full",
              headerTitle: "text-3xl font-extrabold text-indigo-700 mb-2",
              headerSubtitle: "text-indigo-500 mb-4",
              socialButtonsBlockButton: `
                bg-indigo-50 border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-100
                text-indigo-700 font-semibold py-3 px-4 rounded-xl transition-all duration-300 
                shadow-lg hover:shadow-xl mb-3 group
              `,
              socialButtonsBlockButtonText: "text-indigo-700 font-semibold text-base",
              socialButtonsBlockButtonArrow: "text-indigo-400 group-hover:text-pink-400 transition-colors",
              dividerLine: "bg-indigo-200",
              dividerText: "text-indigo-500 font-medium text-sm px-4 bg-indigo-50",
              dividerRow: "my-6",
              formFieldLabel: "text-indigo-700 font-semibold text-sm mb-2",
              formFieldInput: `
                bg-white border border-indigo-200 text-indigo-900
                focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/20 
                rounded-xl px-4 py-3 transition-all duration-300 font-medium
                placeholder:text-indigo-400 hover:border-indigo-400
              `,
              formFieldInputShowPasswordButton: "text-indigo-400 hover:text-pink-400 transition-colors",
              formButtonPrimary: `
                bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 hover:from-indigo-600 hover:to-pink-500
                text-white font-semibold py-3 px-6 rounded-xl 
                transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-pink-400/25
                w-full mt-4 focus:ring-2 focus:ring-pink-400/20 focus:outline-none
              `,
              footerActionLink:
                "text-pink-500 hover:text-pink-400 font-semibold transition-colors duration-200 hover:underline",
              footerActionText: "text-indigo-500 font-medium",
              footerAction: "mt-6 text-center",
              formFieldErrorText: "text-red-500 font-medium text-sm mt-1",
              alertClerkError:
                "text-red-600 bg-red-100 border border-red-200 rounded-xl p-4 mb-4",
              formFieldSuccessText: "text-green-500 font-medium text-sm mt-1",
              otpCodeFieldInput: `
                bg-white border border-indigo-200 text-indigo-900 
                focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 rounded-lg w-12 h-12 text-center font-bold text-lg
                transition-all duration-300
              `,
              spinner: "text-pink-400",
              form: "space-y-4",
              formField: "space-y-2",
              identityPreviewText: "text-indigo-700 font-medium",
              identityPreviewEditButton: "text-pink-500 hover:text-pink-400 font-semibold hover:underline",
            },
            variables: {
              colorBackground: "#fff",
              colorText: "#1e293b",
              colorPrimary: "#6366f1",
              colorDanger: "#ef4444",
              colorSuccess: "#10b981",
              colorWarning: "#f59e0b",
              colorNeutral: "#6b7280",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "16px",
              borderRadius: "16px",
              spacingUnit: "1rem",
            },
            layout: {
              socialButtonsPlacement: "top",
              showOptionalFields: true,
              logoPlacement: "none",
            },
          }}
          redirectUrl="/home"
          routing="path"
          path="/sign-up"
        />
      </div>
    </div>
  );
}