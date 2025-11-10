import { SignUp } from "@clerk/nextjs";
import Logo from "@/components/logo";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-sky-950 via-indigo-900 to-purple-900 overflow-hidden relative">
      {/* Decorative glowing orbs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-sky-700/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-pink-700/25 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-indigo-700/20 rounded-full blur-2xl animate-pulse"></div>

      {/* Left Section - Branding */}
      <div className="hidden md:flex flex-col justify-center items-start text-left p-12 w-1/2 space-y-8 relative z-10 ml-4">
        <Logo className="scale-150 mb-6 ml-10 drop-shadow-[0_0_15px_rgba(96,165,250,0.4)]" />

        <h1 className="text-5xl font-extrabold leading-tight bg-gradient-to-r from-sky-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
          Create your Cloudinary Studio account
        </h1>

        <p className="text-base text-indigo-100/80 max-w-md leading-relaxed">
          Upload, transform, and manage your media effortlessly —  
          Sign up to begin your creative journey with Cloudinary Studio 🚀
        </p>

        <div className="flex items-center gap-1 mt-0.5">
          <p className="text-sky-200 font-semibold tracking-wide">
            Empowering creators globally 🌎
          </p>
        </div>
      </div>

      {/* Right Section - Clerk SignUp */}
      <div className="relative z-10 flex justify-center items-center w-full md:w-1/2 p-8">
        <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-sky-200/30 p-6">
          <SignUp
            appearance={{
              elements: {
                card: "bg-transparent shadow-none border-none",
                headerTitle: "text-3xl font-bold text-sky-700 mb-2",
                headerSubtitle: "text-indigo-500 mb-4",
                socialButtonsBlockButton: `
                  bg-sky-50 border border-sky-200 hover:border-indigo-400 hover:bg-indigo-100
                  text-indigo-700 font-semibold py-3 px-4 rounded-xl transition-all duration-300 
                  shadow-lg hover:shadow-xl mb-3
                `,
                formFieldInput: `
                  bg-white border border-sky-200 text-indigo-900
                  focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/20 
                  rounded-xl px-4 py-3 transition-all duration-300 font-medium
                  placeholder:text-indigo-400 hover:border-indigo-400
                `,
                formButtonPrimary: `
                  bg-gradient-to-r from-sky-500 via-indigo-500 to-pink-400 hover:from-sky-600 hover:to-pink-500
                  text-white font-semibold py-3 px-6 rounded-xl 
                  transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-pink-400/25
                  w-full mt-4 focus:ring-2 focus:ring-pink-400/20 focus:outline-none
                `,
                footerAction: "mt-6 text-center",
                footerActionLink:
                  "text-pink-500 hover:text-pink-400 font-semibold transition-colors duration-200 hover:underline",
                footerActionText: "text-sky-500 font-medium",
              },
              variables: {
                colorPrimary: "#38bdf8",
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
            path="/sign-up"
          />
        </div>
      </div>

      {/* Moving gradient line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-sky-400 via-pink-400 to-transparent animate-[move_5s_linear_infinite]" />
    </div>
  );
}
