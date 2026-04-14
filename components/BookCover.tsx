import * as React from "react";
import { cn } from "@/lib/utils";
import BookCoverSvg from "./BookCoverSvg";
import Image from "next/image";

type BookCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide";

const variantStyles: Record<BookCoverVariant, string> = {
  extraSmall: "book-cover_extra_small",
  small: "book-cover_small",
  medium: "book-cover_medium",
  regular: "book-cover_regular",
  wide: "book-cover_wide",
};

const variantSizes: Record<BookCoverVariant, string> = {
  extraSmall: "29px",
  small: "55px",
  medium: "144px",
  regular: "(max-width: 479px) 114px, 174px",
  wide: "(max-width: 479px) 256px, 296px",
};

interface Props {
  className?: string;
  variant?: BookCoverVariant;
  coverColor: string;
  coverImage: string;
  priority?: boolean;
}
const BookCover = ({
  className,
  variant = "regular",
  coverColor = "#012B48",
  coverImage = "https://placehold.co/400x600.png",
  priority = false,
}: Props) => {
  return (
    <div
      className={cn(
        "relative transition-all duration-300",
        variantStyles[variant],
        className,
      )}
    >
      <BookCoverSvg coverColor={coverColor} />

      <div
        className="absolute z-10"
        style={{ left: "12%", width: "87.5%", height: "88%" }}
      >
        <Image
          src={coverImage}
          alt="Book Cover"
          fill
          priority={priority}
          sizes={variantSizes[variant]}
          className="rounded-sm object-fill"
        />
      </div>
    </div>
  );
};

export default BookCover;
