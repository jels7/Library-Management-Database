SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- Create the 'Patrons' table
CREATE TABLE IF NOT EXISTS Patrons (
    patronID INT AUTO_INCREMENT NOT NULL,
    patronName VARCHAR(45) NOT NULL,
    phoneNum CHAR(10) NOT NULL,
    membershipDate DATE NOT NULL,
    PRIMARY KEY (patronID)
);

-- Create the 'Genres' table
CREATE TABLE IF NOT EXISTS Genres (
    genreID INT AUTO_INCREMENT NOT NULL,
    genreName VARCHAR(45) NOT NULL,
    PRIMARY KEY (genreID)
);

-- Create the 'Donations' table
CREATE TABLE IF NOT EXISTS Donations (
    donationID INT AUTO_INCREMENT NOT NULL,
    donorName VARCHAR(45) NOT NULL,
    donationDate DATE NOT NULL,
    PRIMARY KEY (donationID)
);

-- Create the 'Books' table
CREATE TABLE IF NOT EXISTS Books (
    bookID INT AUTO_INCREMENT NOT NULL,
    bookTitle VARCHAR(255) NOT NULL,
    genreID INT NOT NULL,
    donationID INT DEFAULT NULL,
    copiesAvailable INT NOT NULL,
    PRIMARY KEY (bookID),
    FOREIGN KEY (genreID) REFERENCES Genres(genreID),
    FOREIGN KEY (donationID) REFERENCES Donations(donationID) ON DELETE SET NULL
);

-- Create the 'BorrowedBooks' table
CREATE TABLE IF NOT EXISTS BorrowedBooks (
    borrowedBookID INT AUTO_INCREMENT NOT NULL,
    patronID INT NOT NULL,
    bookID INT NOT NULL,
    borrowDate DATE NOT NULL,
    returnDate DATE DEFAULT NULL,
    dueDate DATE DEFAULT NULL,
    PRIMARY KEY (borrowedBookID),
    FOREIGN KEY (patronID) REFERENCES Patrons(patronID) ON DELETE CASCADE,
    FOREIGN KEY (bookID) REFERENCES Books(bookID) ON DELETE CASCADE
);

-- Insert example data into 'Patrons' table
INSERT INTO Patrons (patronName, phoneNum, membershipDate) VALUES
('John Smith', '5551234567', '2023-01-15'),
('Jane Doe', '5551237890', '2023-03-20'),
('Alan Turing', '5551231234', '2024-07-11'),
('Ada Lovelace', '5551234321', '2024-10-05'),
('Charles Babbage', '5551235678', '2024-11-12');

-- Insert example data into 'Genres' table
INSERT INTO Genres (genreName) VALUES
('Adventure'),
('Cooking'),
('Science'),
('Mystery'),
('Fiction');

-- Insert example data into 'Donations' table
INSERT INTO Donations (donorName, donationDate) VALUES
('Jane Doe', '2023-01-10'),
('John Smith', '2023-02-14'),
('Mary Johnson', '2023-03-01'),
('Emily Davis', '2024-01-10'),
('Robert Brown', '2024-06-11');

-- Insert example data into 'Books' table
INSERT INTO Books (bookTitle, genreID, donationID, copiesAvailable) VALUES
('The Great Adventure', 1, 1, 3),
('Cooking for Beginners', 2, 2, 5),
('Science Made Simple', 3, 3, 2),
('The Mystery Unfolds', 4, 4, 4),
('The Great Gatsby', 5, 5, 3);

-- Insert example data into 'BorrowedBooks' table
INSERT INTO BorrowedBooks (patronID, bookID, borrowDate, returnDate, dueDate) VALUES
(1, 1, '2023-01-20', '2023-02-10', '2023-02-03'),
(2, 2, '2023-03-25', '2023-04-05', '2023-04-02'),
(3, 3, '2024-07-12', NULL, '2024-07-22'),
(4, 4, '2024-10-07', '2024-10-11', '2024-10-18'),
(5, 5, '2024-12-10', NULL, '2024-12-24');

SET FOREIGN_KEY_CHECKS=1;
COMMIT;