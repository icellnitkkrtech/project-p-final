import React from "react";
import Slider from "react-slick";
import { Box, Typography } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PastRecruiters = () => {
  // Array of company logos (URLs or public folder paths)
  const companyLogos = [
    "/tnp-americanexp.jpg",
    "/tnp-akash.jpg",
    "/amazon-tnp.jpg",
    "/microsoft1-tnp.jpg",
    "/ford-tnp.jpg",
    "/adobe-tnp.jpg",
    "/tnp-delhrivery.jpg",
  ];

  // Slick slider settings
  const settings = {
    infinite: true, // Enables infinite scrolling
    slidesToShow: 5, // Number of logos visible at a time
    slidesToScroll: 1, // Logos to scroll per cycle
    autoplay: true, // Enables auto scrolling
    autoplaySpeed: 1500, // Cycle time in ms
    pauseOnHover: true, // Pause when hovered
    responsive: [
      {
        breakpoint: 1024, // For tablets
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600, // For mobile
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <Box
      sx={{
        paddingTop: { xs: "80px", sm: "100px", md: "100px", lg: "120px" }, 
        backgroundColor: "#f7faff",
        padding: "60px",
      }}
    >
      {/* Heading */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "20px",
            color: "#2c3e50",
            fontSize: {
              xs: "2rem", 
              sm: "2.5rem", 
              md: "2.8rem", 
              lg: "3rem", 
            },
          }}
        >
        Past Recruiters
      </Typography>

      {/* Carousel Section */}
      <Slider {...settings}>
        {companyLogos.map((logo, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              src={logo}
              alt={`Company ${index + 1}`}
              sx={{
                maxWidth: "120px",
                margin: "0 auto",
                transition: "filter 0.3s ease-in-out",
              }}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default PastRecruiters;
