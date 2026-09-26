import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import donationVolunteers from "../../../assets/food-donation-volunteers.jpg";
import { useAuth } from "../../../app/authContext";
import { firebaseConfigured } from "../../../shared/firebase/client";
import { signIn, signUp, requestPasswordReset } from "../api/auth.api";
import { validateAccount, validateEmail } from "../auth.schema";
import { toAppError } from "../../../shared/errors/appError";
import { fieldClass, Notice, primaryClass } from "../../../shared/ui/Elements";

export default function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, loading, profileLoading } = useAuth();
  const requestedPath = (location.state as { from?: string } | null)?.from;
  const from =
    requestedPath?.startsWith("/") && !requestedPath.startsWith("//")
      ? requestedPath
      : "/dashboard";
  const signup = mode === "signup";

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    const validation = resetMode
      ? validateEmail(email)
      : validateAccount(email, password, signup ? username : undefined);
    if (validation) {
      setError(validation);
      return;
    }
    setPending(true);
    try {
      if (resetMode) {
        await requestPasswordReset(email);
        setSuccess(
          "If an account exists for this email, a reset link is on its way.",
        );
      } else {
        if (signup) await signUp(email, password, username);
        else await signIn(email, password);
        navigate(from, { replace: true });
      }
    } catch (cause) {
      setError(toAppError(cause).message);
    } finally {
      setPending(false);
    }
  }

  if (!loading && user && !pending && !profileLoading) {
    return <Navigate to={profile ? from : "/profile"} replace />;
  }

  return (
    <div className="grid min-h-screen bg-stone-100 lg:min-h-0 lg:grid-cols-12 dark:bg-forest-950">
      <div className="relative hidden min-h-screen overflow-hidden lg:col-span-6 lg:block xl:col-span-7">
        <img
          src={donationVolunteers}
          alt="Volunteers sorting donated food for community distribution"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/10 to-transparent" />
        <div className="absolute bottom-0 left-0 max-w-2xl px-12 pb-16 text-white 2xl:px-20">
          <p className="text-xs font-bold uppercase tracking-widest text-white/80">
            FoodBridge community
          </p>
          <h2 className="mt-5 font-display text-5xl leading-tight xl:text-6xl">
            Good things grow when we share.
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-stone-100">
            Join neighbors giving surplus food and everyday essentials a useful
            next stop.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-14 sm:px-8 lg:col-span-6 lg:px-12 lg:py-20 xl:col-span-5 2xl:px-20">
        <div className="w-full max-w-xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-forest-700 dark:text-forest-500"
          >
            <ArrowLeft size={16} /> Back to home
          </Link>
          <div className="mt-12 border-b border-stone-300 pb-7 dark:border-stone-700">
            <p className="text-xs font-bold uppercase tracking-widest text-forest-600 dark:text-forest-500">
              {resetMode
                ? "Account help"
                : signup
                  ? "Join FoodBridge"
                  : "Welcome back"}
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
              {resetMode
                ? "Reset your password"
                : signup
                  ? "Make room for more good."
                  : "Pick up where you left off."}
            </h1>
            <p className="mt-4 text-stone-600 dark:text-stone-400">
              {resetMode
                ? "Enter your email and we will send you a link to set a new password."
                : signup
                  ? "Create an account to share with your community."
                  : "Sign in to manage your account and listings."}
            </p>
          </div>
          <form
            onSubmit={(event) => void submit(event)}
            className="mt-8 space-y-5"
          >
            {signup && !resetMode && (
              <label className="block text-sm font-semibold text-stone-800 dark:text-stone-200">
                Your name
                <input
                  autoComplete="name"
                  required
                  maxLength={60}
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className={`${fieldClass} mt-2`}
                  placeholder="Jane Doe"
                  aria-invalid={Boolean(error) && username.trim().length < 2}
                />
              </label>
            )}
            <label className="block text-sm font-semibold text-stone-800 dark:text-stone-200">
              Email address
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={`${fieldClass} mt-2`}
                placeholder="you@example.com"
              />
            </label>
            {!resetMode && (
              <label className="block text-sm font-semibold text-stone-800 dark:text-stone-200">
                Password
                <span className="relative mt-2 block">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete={signup ? "new-password" : "current-password"}
                    required
                    minLength={signup ? 8 : undefined}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={`${fieldClass} pr-12`}
                    placeholder={
                      signup ? "At least 8 characters" : "Enter your password"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-stone-500 hover:text-forest-700 dark:text-stone-400 dark:hover:text-forest-500"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </span>
              </label>
            )}
            {!signup && !resetMode && (
              <button
                type="button"
                onClick={() => {
                  setResetMode(true);
                  setError("");
                  setSuccess("");
                }}
                className="text-sm font-semibold text-forest-700 hover:underline dark:text-forest-500"
              >
                Forgot password?
              </button>
            )}
            {!firebaseConfigured && (
              <Notice error>
                Firebase is not configured. Add the public configuration to .env
                to use accounts.
              </Notice>
            )}
            {error && <Notice error>{error}</Notice>}
            {success && <Notice>{success}</Notice>}
            <button
              type="submit"
              disabled={pending || !firebaseConfigured}
              className={`${primaryClass} w-full`}
            >
              {pending
                ? "Please wait…"
                : resetMode
                  ? "Send reset link"
                  : signup
                    ? "Create account"
                    : "Log in"}
              {!pending && <ArrowRight size={17} aria-hidden="true" />}
            </button>
          </form>
          <div className="mt-7 border-t border-stone-300 pt-6 text-sm text-stone-600 dark:border-stone-700 dark:text-stone-400">
            {resetMode ? (
              <button
                type="button"
                onClick={() => {
                  setResetMode(false);
                  setError("");
                  setSuccess("");
                }}
                className="font-bold text-forest-700 dark:text-forest-500"
              >
                Back to log in
              </button>
            ) : (
              <>
                {signup ? "Already have an account?" : "New to FoodBridge?"}{" "}
                <Link
                  className="ml-1 font-bold text-forest-700 dark:text-forest-500"
                  to={signup ? "/login" : "/signup"}
                >
                  {signup ? "Log in" : "Create an account"}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
