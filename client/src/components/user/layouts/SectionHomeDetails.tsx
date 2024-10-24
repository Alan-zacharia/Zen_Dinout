import React from "react";

const SectionHomeDetails: React.FC = () => {
  return (
    <>
      <div className="">
        <h3 className="font-bold text-orange-500 flex px-52 2xl:px-80 underline">
          Available in{" "}
        </h3>
      </div>
      <section className="footer  p-14 px-32  text-base-content font-semibold">
        <div className="hidden lg:flex"></div>
        <nav>
          <p className="link link-hover text-gray-400">Kochi </p>
          <p className="link link-hover text-gray-400">Thrissur</p>
          <p className="link link-hover text-gray-400">Alappuzha </p>
        </nav>
        <nav>
          <p className="link link-hover text-gray-400">Aluva</p>
          <p className="link link-hover text-gray-400">Malappuram </p>
          <p className="link link-hover text-gray-400">Trivandrum</p>
        </nav>
        <nav>
          <p className="link link-hover text-gray-400">Delhi</p>
          <p className="link link-hover text-gray-400">Bombay</p>
          <p className="link link-hover text-gray-400">Guhatti</p>
        </nav>
        <nav>
          <p className="link link-hover text-gray-400">Jammu</p>
          <p className="link link-hover text-gray-400">Karataka</p>
          <p className="link link-hover text-gray-400">hyderabad</p>
        </nav>
        <nav>
          <p className="link link-hover text-gray-400">kasarkode</p>
          <p className="link link-hover text-gray-400">Goa</p>
          <p className="link link-hover text-gray-400">Bangloor</p>
        </nav>

        <nav></nav>
      </section>
    </>
  );
};

export default SectionHomeDetails;
