
import LoginForm from "../../components/candidate/login/LoginForm";
import PromoCard from "../../components/candidate/login/PromoCard";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid md:grid-cols-2">

      {/* Left Side */}
      <div className="relative bg-[#EEF0F8] flex flex-col justify-between items-center overflow-hidden p-4 min-h-screen">

        {/* Top-right circle (outline only, partially cut off) */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full border-28 border-[#C8CCEB]" />

        {/* Bottom-left organic blob */}
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-[#C8CCEB] rounded-[60%_40%_40%_60%/40%_40%_60%_60%]" />

        <div className="h-2"></div>

        <div className="relative z-10 w-full flex justify-center">
          <LoginForm />
        </div>

        {/* Footer / Copyright */}
        <footer className="relative z-10 py-3 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} <span className="font-semibold text-gray-700">HedgeVerify</span>. All rights reserved.</p>
        </footer>
      </div>

      {/* Right Side */}
      <PromoCard />
    </div>
  );
}