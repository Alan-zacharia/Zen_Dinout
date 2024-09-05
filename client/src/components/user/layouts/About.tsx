import React from "react";
import AboutImage from "../../../assets/restaurant_1.jpeg";
import { motion } from "framer-motion";

const About: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center  lg:justify-normal min-h-screen p-6 bg-gray-100">
      <header className="text-center mb-12">
        <motion.h1
          className="text-4xl font-extrabold text-gray-800 mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
           Zen<span className="text-orange-600">Dinout</span>
        </motion.h1>
        <motion.p
          className="text-lg text-gray-600"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Discover the easiest way to reserve your table at your favorite
          restaurants.
        </motion.p>
      </header>

      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl mx-auto">
        <motion.div
          className="w-full md:w-1/2 p-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={AboutImage}
            alt="Zen Dinout"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </motion.div>

        <div className="w-full md:w-1/2 p-4">
          <motion.h2
            className="text-2xl font-bold text-gray-700 mb-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Our Mission
          </motion.h2>
          <motion.p
            className="text-base text-gray-600 mb-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            At Zen Dinout, we are dedicated to providing a seamless and
            enjoyable dining reservation experience. Our platform connects you
            with a wide range of restaurants, allowing you to book tables with
            ease, manage your reservations, and receive timely updates. Whether
            you're planning a casual dinner or a special celebration, we make it
            simple to secure your spot at the best dining spots in town.
          </motion.p>
          <motion.p
            className="text-base text-gray-600 mb-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Join us in revolutionizing the way you dine out. Our user-friendly
            interface and dedicated customer support team ensure that your
            dining experiences are always memorable and stress-free.
          </motion.p>
        </div>
      </div>

      {/* Additional Content Section */}
      <motion.div
        className="w-full max-w-5xl mx-auto p-4 mt-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Our Team</h2>
        <p className="text-base text-gray-600 mb-4">
          Our team consists of passionate individuals dedicated to making your
          dining experiences as delightful as possible. From tech experts to
          customer service professionals, we all share a common goal of
          excellence in the dining reservation process.
        </p>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Our History</h2>
        <p className="text-base text-gray-600">
          Founded in [Year], Zen Dinout started as a small project with a big
          vision: to simplify dining reservations and enhance the dining
          experience. Over the years, we have grown and evolved, continually
          improving our platform and expanding our network of partner
          restaurants.
        </p>
      </motion.div>
    </div>
  );
};

export default About;
