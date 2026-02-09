import { PiBowlFoodLight } from "react-icons/pi";

const Newsletter = () => {
  return (
    <section className="flex flex-col items-center justify-center px-4 py-16 mt-20 bg-red-200 sm:px-6 md:px-14 lg:px-24 xl:px-44 rounded-xl">
      <h2 className="flex flex-col items-center gap-2 mb-4 text-3xl font-semibold text-center sm:text-left">
        <PiBowlFoodLight className="w-14 h-14" />
        Subscribe to our Newsletter
      </h2>
      <p className="mb-6 text-center text-gray-700 sm:text-left">
        Stay updated with the newest recipes, cooking tips, and exclusive
        content.
      </p>
      <button className="px-6 py-2 text-xl text-white bg-black rounded-3xl">
        Subscribe
      </button>
    </section>
  );
};

export default Newsletter;
