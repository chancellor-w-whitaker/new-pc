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
          1200: { slidesPerView: 4 },
          768: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
        }}
        autoplay={{ pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        className="py-3"
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
