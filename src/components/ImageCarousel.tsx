'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type ImageCarouselProps = {
  images: Array<{ url: string }>;
  projectName: string;
};

export default function ImageCarousel({ images, projectName }: ImageCarouselProps) {
    return (
        <Swiper
            modules={[Navigation, Pagination, A11y, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="w-full h-full rounded-lg"
        >
            {images.map((image, index) =>(
                <SwiperSlide key={index}>
                    <div className="relative aspect-video w-full">
                        <Image
                            src={image.url}
                            alt={`${projectName} - Image ${index + 1}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
