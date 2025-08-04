'use client'
import type { Route } from "../../+types/root";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "UKPMS" },
    { name: "description", content: "Welcome to UKPMS!" },
  ];
}

const Homepage = () => {
  return (

    <div className="w-full h-screen flex flex-col items-center justify-center gap-y-10">
      <div className='w-full lg:w-2/3 flex flex-col items-center justify-center'>
        <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
          <span className='flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base dark:border-gray-700 dark:text-blue-400 border-gray-300 text-gray-600'>
            Manage all your task in one place!
          </span>
          <div className="flex flex-col justify-center items-center">
            <img src='favicon.ico' alt="ukpms_logo" className="w-[100px]" />
            <p className='flex flex-col gap-0 md:gap-4 text-3xl md:text-5xl 2xl:text-5xl font-black text-center dark:text-gray-400 text-blue-700'>
              <span>Uttarakhand </span>
              <span>Sports Department</span>
              <span>Project Management System</span>
            </p>
          </div>
        </div>
      </div>

      <div className=" flex items-center justify-center gap-4">
        <Link to="/sign-in">
          <Button variant='outline' className="hover:bg-blue-700 hover:text-white">Login</Button>
        </Link>
        <Link to="/sign-up">
          <Button variant="outline" className="hover:bg-blue-700 hover:text-white">
            Sign Up
          </Button>
        </Link>
      </div>
    </div>

  );
};

export default Homepage;
