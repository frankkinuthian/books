import Image from "next/image";
import React from "react";

const BookOverview = () => {
  return (
    <section className="book-overview">
      <div className="flex flex-1 flex-col gap-5">A long book title</div>

      <div className="book-info">
        <p>
          By <span className="font-semibold text-light-200">Author name</span>
        </p>

        <p>
          Category <span className="font-semibold text-light-200">Genre</span>
        </p>

        <div className="flex flex-row gap-1">
          <Image src="/icons/star.svg" alt="star" width={22} height={22} />
          <p>Rating</p>
        </div>
      </div>
    </section>
  );
};

export default BookOverview;
