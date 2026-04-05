import * as React from "react";
import BookCard from "./BookCard";

interface BookListItem {
  id: string | number;
  title: string;
  genre: string;
  coverColor: string;
  coverUrl: string;
  isLoanedBook?: boolean;
}

interface Props {
  title: string;
  books: BookListItem[];
  containerClassName?: string;
}

const BookList = ({ title, books, containerClassName }: Props) => {
  return (
    <section className={containerClassName}>
      <h2 className="font-bebas-neue text-4xl text-light-100">{title}</h2>

      <ul className="book-list">
        {books.map((book) => (
          <BookCard key={book.title} {...book} />
        ))}
      </ul>
    </section>
  );
};

export default BookList;
