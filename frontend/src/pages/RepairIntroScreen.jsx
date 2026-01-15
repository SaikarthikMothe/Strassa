import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay } from "swiper/modules"
import { useNavigate } from "react-router-dom"

import "swiper/css"
import "swiper/css/pagination"

import flattyreimg from "../assets/flattyre.png"
import towing from "../assets/towing.png"
import breakdown from "../assets/breakdown.png"

const slides = [
  {
    title: "Flat Tyre",
    description: "Quick on-the-spot tyre assistance at your location.",
    image: flattyreimg,
  },
  {
    title: "Car Towing",
    description: "Fast and reliable towing service whenever you need it.",
    image: towing,
  },
  {
    title: "Breakdown Support",
    description: "Help for battery, fuel, engine trouble, or locked keys.",
    image: breakdown,
  },
]

const RepairIntroScreen = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.screen}>
      <Swiper
        modules={[Pagination, Autoplay]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        speed={800}
        loop
        slidesPerView={1}
        pagination={{ clickable: true }}
        style={styles.swiper}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div style={styles.slide}>
              {/* IMAGE */}
              <div style={styles.imageWrap}>
                <img
                  src={slide.image}
                  alt={slide.title}
                  style={styles.image}
                />
              </div>

              {/* TEXT */}
              <h2 style={styles.title}>{slide.title}</h2>
              <p style={styles.description}>{slide.description}</p>

              {/* CTA */}
              <button
                style={styles.button}
                onClick={() => 
                  navigate("/repair/request", { replace: true })
                }
              >
                Get Started
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination styling */}
      <style>{`
        .swiper-pagination {
          bottom: 120px !important;
        }
        .swiper-pagination-bullet {
          background: #555;
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: #facc15;
        }
      `}</style>
    </div>
  )
}

const styles = {
  screen: {
    height: "100vh",
    width: "100vw",
    backgroundColor: "#000",
  },

  swiper: {
    height: "100%",
    width: "100%",
  },

  slide: {
    height: "100%",
    padding: "48px 24px 32px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#fff",
  },

  imageWrap: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  textWrap: {
  marginTop: "-10px",   // ⬅ moves title+description up
  textAlign: "center",
},

  image: {
    maxWidth: "90%",
    maxHeight: "360px",
    objectFit: "contain",
  },

  title: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "8px",
  },

 description: {
  fontSize: "18px",
  color: "#aaa",
  textAlign: "center",
  maxWidth: "320px",
  lineHeight: "1.5",
  marginBottom: "60px",   // ⬅ creates space before dots
},


  button: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#facc15",
    border: "none",
    borderRadius: "16px",
    fontSize: "20px",
    fontWeight: "600",
    color: "#000",
    cursor: "pointer",
    marginTop: "auto",
  },
}

export default RepairIntroScreen
