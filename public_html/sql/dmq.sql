-- Group 7: Anjelica Cucchiara, Meredith Baker

-- 1. Insert into Genres first
INSERT INTO Genres (genreName) VALUES ('Fiction');

-- 2. Insert into Patrons
INSERT INTO Patrons (patronName, phoneNum, membershipDate) 
VALUES ('John Doe', '1234567890', '2025-02-26');

-- 3. Insert into Books (after Genres exist)
INSERT INTO Books (bookTitle, genreID, copiesAvailable)
VALUES ('New Book', 
    (SELECT genreID FROM Genres WHERE genreName = 'Fiction' LIMIT 1), 
    10
);

-- 4. Insert into Donations (after Books exist)
INSERT INTO Donations (donorName, bookID, donationDate) 
VALUES ('John Donor', (SELECT bookID FROM Books WHERE bookTitle = 'New Book' LIMIT 1), '2025-02-26');

-- 5. Insert into BorrowedBooks (after Books and Patrons exist)
INSERT INTO BorrowedBooks (patronID, bookID, borrowDate, returnDate, dueDate)
VALUES (
    (SELECT patronID FROM Patrons WHERE patronName = 'John Doe' LIMIT 1), 
    (SELECT bookID FROM Books WHERE bookTitle = 'New Book' LIMIT 1), 
    '2025-02-26', '2025-03-01', '2025-03-05'
);

-- Queries with INNER JOINS
SELECT Books.bookID, Books.bookTitle, Genres.genreName, Donations.donationID, Books.copiesAvailable 
FROM Books
INNER JOIN Genres ON Books.genreID = Genres.genreID
INNER JOIN Donations ON Books.bookID = Donations.bookID;

SELECT Donations.donationID, Donations.donorName, Donations.donationDate, Books.bookTitle 
FROM Donations
INNER JOIN Books ON Donations.bookID = Books.bookID;

SELECT BorrowedBooks.borrowedBookID, Patrons.patronID, Patrons.patronName, Books.bookID, Books.bookTitle, 
BorrowedBooks.borrowDate, BorrowedBooks.returnDate, BorrowedBooks.dueDate 
FROM BorrowedBooks
INNER JOIN Patrons ON Patrons.patronID = BorrowedBooks.patronID
INNER JOIN Books ON Books.bookID = BorrowedBooks.bookID;

-- Updates
UPDATE Patrons
SET patronName = 'Jane Doe', phoneNum = '0987654321', membershipDate = '2025-02-27'
WHERE patronID = (SELECT patronID FROM Patrons WHERE patronName = 'John Doe' LIMIT 1);

UPDATE Books
SET bookTitle = 'Updated Book'
WHERE bookID = (SELECT bookID FROM Books WHERE bookTitle = 'New Book' LIMIT 1);

UPDATE Donations
SET donorName = 'Updated Donor', donationDate = '2025-02-27'
WHERE donationID = (SELECT donationID FROM Donations WHERE donorName = 'John Donor' LIMIT 1);

UPDATE BorrowedBooks
SET returnDate = '2025-03-02', dueDate = '2025-03-06'
WHERE borrowedBookID = (SELECT borrowedBookID FROM BorrowedBooks LIMIT 1);

-- Deletion (delete dependent records first)
DELETE FROM BorrowedBooks 
WHERE bookID IN (SELECT bookID FROM Books WHERE bookTitle = 'New Book');

DELETE FROM Donations 
WHERE bookID IN (SELECT bookID FROM Books WHERE bookTitle = 'New Book');

DELETE FROM Books 
WHERE bookTitle = 'New Book';

-- Only delete genre if no books are left using it
DELETE FROM Genres 
WHERE genreID IN (
    SELECT genreID FROM Genres 
    WHERE genreID NOT IN (SELECT DISTINCT genreID FROM Books)
);
