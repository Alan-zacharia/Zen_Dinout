import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Img from "../../assets/login-admin.jpg";

interface Properties {
  onClick: () => void;
}

const NextArrow: React.FC<Properties> = (props) => {
  const { onClick } = props;
  return (
    <div
      className="slick-arrow slick-next "
      style={{
        display: "block",
        background: "#00FF00",
        borderRadius: "100%",
        width: "19px",
        height: "18px",
        lineHeight: "12px",
        textAlign: "center",
        fontSize: "24px",
        color: "white",
        position: "absolute",
        top: "50%",
        right: "-30px",
        zIndex: "1",
        cursor: "pointer",
      }}
      onClick={onClick}
    />
  );
};

const PrevArrow: React.FC<Properties> = (props) => {
  const { onClick } = props;
  return (
    <div
      className="slick-arrow slick-prev"
      style={{
        display: "block",
        background: "#00FF00",
        borderRadius: "100%",
        width: "19px",
        height: "18px",
        lineHeight: "12px",
        textAlign: "center",
        position: "absolute",
        top: "50%",
        right: "-30px",
        zIndex: "1",
        cursor: "pointer",
      }}
      onClick={onClick}
    />
  );
};

interface DataItem {
  title: string;
}

function Carousel() {
  const [array, setArray] = useState<DataItem[]>([]);

  useEffect(() => {
    const data: DataItem[] = [
      { title: "Sea Food" },
      { title: "Kubaba" },
      { title: "Arabian palace" },
      { title: "America palace" },
      { title: "Al Reem" },
    ];
    setArray(data);
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    nextArrow: isMobile ? <div /> : <NextArrow onClick={() => {}} />,
    prevArrow: isMobile ? <div /> : <PrevArrow onClick={() => {}} />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  return (
    <>
      <div className="slider-container">
        <Slider {...settings}>
          {array.map((item, index) => {
            return (
              <div key={index} className="p-4">
                <div className="">
                  <img src={Img} alt="" />
                </div>
                <h3>{item.title}</h3>
              </div>
            );
          })}
        </Slider>
      </div>
    </>
  );
}

export default Carousel;
