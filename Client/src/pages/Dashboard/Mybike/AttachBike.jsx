import React, { useState } from "react";
import { API_URL } from "../../../config";
function AttachBike() {
  const [email, setEmail] = useState("");
  const [phone, setphone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const data = {
      email: email + "@gmail.com",
      phone: phone,
    };

    try {
      const response = await fetch(`http://${API_URL}/Admin/getAttached/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSuccess(true);
        setIsLoading(false);
      } else {
        // Handle errors
        console.error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white flex flex-col  nx:ml-[40vw] h-[100%] ">
      <div className="h-[100%] w-[400px] sm:w-full  flex flex-col items-center justify-center p-9">
        <div className="flex flex-col items-center shadow m-4 pt-16  h-[500px] sm:rounded-tr-[200px] sm:rounded-bl-[200px] rounded-bl-[10px] rounded-tr-[100px] w-[320px] sm:w-[500px] bg-cover bg-center border-[12px] border-yellow-400">
          <h1 className="text-black text-sm sm:text-2xl text-center font-bold underline px-2 sm:px-4 py-2 mb-8">
            Send Invitation to our partner.
          </h1>
          {isLoading ? (
            <p>Loading...</p>
          ) : isSuccess ? (
            <p>Form submitted successfully. Redirecting...</p>
          ) : (
            <div></div>
          )}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center"
          >
            <div className="bg-white p-4 rounded-lg ">
              <label className="t font-bold  text-black">Phone number</label>
              <div className="relative mt-2  text-gray-500">
                <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
                  <select className="text-black outline-none rounded-lg h-full">
                    <option>IND</option>
                    <option>US</option>
                    <option>ES</option>
                    <option>MR</option>
                  </select>
                </div>
                <input
                  type="number"
                  placeholder="+91 (555) 000-000"
                  value={[phone]}
                  onChange={(e) => setphone(e.target.value)}
                  className="w-full pl-[4.5rem]   py-4 pr-[25px] text-black appearance-none bg-transparent outline-none border focus:border-slate-600 shadow-sm rounded-lg"
                />
              </div>
            </div>

            <div className="relative mt-6">
              <label className="t text-sm">Gmail </label>
              <input
                type="email"
                placeholder="Email address"
                autoComplete="email"
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-2xl border   border-neutral-300 bg-transparent py-4 pl-6 pr-20 text-black text-neutral-950 ring-4 ring-transparent transition placeholder:text-neutral-500 focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5"
              />
              <div className="absolute inset-y-1/4 right-1 bottom-5  flex items-end justify-end">
                <button
                  type="submit"
                  aria-label="Submit"
                  className="flex aspect-square h-full my-[-1.5vh] items-center justify-center rounded-xl bg-neutral-950 text-white transition hover:bg-yellow-400"
                >
                  <svg viewBox="0 0 16 6" aria-hidden="true" className="w-4">
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M16 3 10 .5v2H0v1h10v2L16 3Z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AttachBike;
