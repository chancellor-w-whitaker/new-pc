import { Pagination, Autoplay } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css/pagination";
import "swiper/css";

import { SubContainer } from "./SubContainer";
import { Card } from "./Card";

export const Section = ({
  icon = <i className="fa-solid fa-school"></i>,
  children = [0, 1, 2, 3],
  header = "Section",
}) => {
  return (
    <SubContainer>
      <h2 className="pb-3 border-bottom d-flex align-items-center gap-2 mb-0">
        {icon}
        <div className="text-truncate">{header}</div>
      </h2>
      <Swiper
        breakpoints={{
          1400: getBreakpointProperties(1224),
          1200: getBreakpointProperties(1044),
          768: getBreakpointProperties(624),
          992: getBreakpointProperties(864),
        }}
        autoplay={{ pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination]}
        className="pt-3 pb-4"
      >
        {children.map((element, index) => (
          <SwiperSlide key={index}>
            <Card {...element}></Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </SubContainer>
  );
};

const getBreakpointProperties = (width) => ({
  spaceBetween:
    (width - Math.floor(width / 250) * 250) / (Math.floor(width / 250) - 1),
  slidesPerView: Math.floor(width / 250),
});
