import { SignIn } from "@clerk/nextjs";
import Logo from "@/components/logo";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-gray-900 overflow-hidden relative">
      {/* Decorative gradient orbs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-700/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-pink-700/20 rounded-full blur-3xl animate-pulse"></div>

      {/* Left Section - Branding / Illustration */}
      <div className="hidden md:flex flex-col justify-center items-start text-left p-12 w-1/2 space-y-8 relative z-10 ml-4">
        {/* Larger Logo */}
        <Logo className="scale-150 mb-6 ml-10 drop-shadow-[0_0_15px_rgba(139,92,246,0.4)]" />

        <h1 className="text-5xl font-extrabold leading-tight bg-gradient-to-r from-indigo-400 via-pink-400 to-purple-500 bg-clip-text text-transparent animate-gradient">
          Welcome back to Cloudinary Studio
        </h1>

        <p className="text-base text-indigo-100/80 max-w-md leading-relaxed">
          Manage, transform, and share your creative assets in seconds.  
          Sign In to continue exploring seamless media magic.
        </p>

        {/* Subtle tagline or badge */}
        <div className="flex items-center gap-1 mt-0.5">
          <p className="text-indigo-200 font-semibold tracking-wide">
            The all-in-one creative Cloud suite
          </p>
        </div>
      </div>

      {/* Right Section - Clerk SignIn */}
      <div className="relative z-10 flex justify-center items-center w-full md:w-1/2 p-8">
        <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-indigo-200/30 p-6">
          <SignIn
            appearance={{
              elements: {
                card: "bg-transparent shadow-none border-none",
                headerTitle: "text-3xl font-bold text-indigo-700 mb-2",
                headerSubtitle: "text-indigo-500 mb-4",
                socialButtonsBlockButton: `
                  bg-indigo-50 border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-100
                  text-indigo-700 font-semibold py-3 px-4 rounded-xl transition-all duration-300 
                  shadow-lg hover:shadow-xl mb-3
                `,
                formFieldInput: `
                  bg-white border border-indigo-200 text-indigo-900
                  focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/20 
                  rounded-xl px-4 py-3 transition-all duration-300 font-medium
                  placeholder:text-indigo-400 hover:border-indigo-400
                `,
                formButtonPrimary: `
                  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 hover:from-indigo-600 hover:to-pink-500
                  text-white font-semibold py-3 px-6 rounded-xl 
                  transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-pink-400/25
                  w-full mt-4 focus:ring-2 focus:ring-pink-400/20 focus:outline-none
                `,
                footerAction: "mt-6 text-center",
                footerActionLink:
                  "text-pink-500 hover:text-pink-400 font-semibold transition-colors duration-200 hover:underline",
                footerActionText: "text-indigo-500 font-medium",
              },
              variables: {
                colorPrimary: "#6366f1",
                fontFamily: "'Inter', system-ui, sans-serif",
                borderRadius: "16px",
              },
              layout: {
                socialButtonsPlacement: "top",
                logoPlacement: "none",
              },
            }}
            redirectUrl="/home"
            routing="path"
            path="/sign-in"
          />
        </div>
      </div>

      {/* Moving gradient line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-400 via-pink-400 to-transparent animate-[move_5s_linear_infinite]" />
    </div>
  );
}
