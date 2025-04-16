import Link from "next/link";

export default function Register() {
  return (
    <section>
      {/* Login Form */}
      <form className="flex flex-col gap-5">
        <header className="mb-5 flex flex-col gap-3 text-start">
          <h1 className="text-4xl font-bold text-gray-800">Register</h1>
          <p className="text-gray-500 max-w-xs">
            We will send a notification to your email once your account is
            ready!!!
          </p>
        </header>

        {/* Email Input */}
        <div className="flex flex-col gap-1">
          <label className="input validator">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </g>
            </svg>
            <input
              type="input"
              required
              placeholder="Name"
              pattern="[A-Za-z][A-Za-z0-9\-]*"
              minLength={3}
              maxLength={30}
              title="Only letters, numbers or dash"
            />
          </label>
        </div>

        {/* Email Input */}
        <div className="flex flex-col gap-1">
          <label className="input validator">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </g>
            </svg>
            <input type="email" placeholder="mail@site.com" required />
          </label>
          <div className="validator-hint hidden">Enter valid email address</div>
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-1">
          <label className="input validator">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
              </g>
            </svg>
            <input
              id="password"
              className="w-full"
              type="password"
              required
              placeholder="Password"
              minLength={8}
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
            />
          </label>
          <p className="validator-hint hidden">
            Must be more than 8 characters, including
            <br />
            At least one number
            <br />
            At least one lowercase letter
            <br />
            At least one uppercase letter
          </p>
        </div>

        {/* Submit Button */}
        <Link
          href="/auth/login"
          className=" hover:underline text-sm text-slate-800"
        >
          Or you have already an{" "}
          <span className=" text-blue-600">account?</span>
        </Link>
        <button
          type="submit"
          className="btn btn-neutral btn-outline max-w-fit "
        >
          Register
        </button>
      </form>
    </section>
  );
}
