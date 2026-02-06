USE winamax;

CREATE TABLE teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO teams (name) VALUES
('Arsenal'),
('Manchester City'),
('Liverpool'),
('Chelsea'),
('Tottenham Hotspur'),
('Manchester United'),
('Newcastle United'),
('Aston Villa'),
('Brighton & Hove Albion'),
('West Ham United'),
('Wolverhampton Wanderers'),
('Fulham'),
('Crystal Palace'),
('Brentford'),
('Bournemouth'),
('Nottingham Forest'),
('Ipswich Town'),
('Southampton United'),
('Leicester City'),
('Everton');

CREATE TABLE players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(50),
    number INT,
    goalsScored INT DEFAULT 0,
    assists INT DEFAULT 0,
    team_id INT,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

INSERT INTO players (name, position, number, goalsScored, assists, team_id) VALUES
('David Raya', 'Goalkeeper', 1, 0, 0, 1),
('Ben White', 'Defender', 4, 1, 4, 1),
('William Saliba', 'Defender', 2, 2, 1, 1),
('Gabriel Magalhães', 'Defender', 6, 3, 0, 1),
('Oleksandr Zinchenko', 'Defender', 35, 1, 3, 1),
('Declan Rice', 'Midfielder', 41, 5, 7, 1),
('Martin Ødegaard', 'Midfielder', 8, 8, 6, 1),
('Kai Havertz', 'Midfielder', 29, 7, 5, 1),
('Bukayo Saka', 'Forward', 7, 14, 11, 1),
('Gabriel Jesus', 'Forward', 9, 9, 4, 1),
('Leandro Trossard', 'Forward', 19, 6, 5, 1);

INSERT INTO players (name, position, number, goalsScored, assists, team_id) VALUES
('Ederson', 'Goalkeeper', 31, 0, 0, 2),
('Kyle Walker', 'Defender', 2, 0, 2, 2),
('Rúben Dias', 'Defender', 3, 1, 1, 2),
('Manuel Akanji', 'Defender', 25, 2, 1, 2),
('Joško Gvardiol', 'Defender', 24, 1, 2, 2),
('Rodri', 'Midfielder', 16, 4, 6, 2),
('Kevin De Bruyne', 'Midfielder', 17, 6, 12, 2),
('Bernardo Silva', 'Midfielder', 20, 5, 7, 2),
('Phil Foden', 'Forward', 47, 15, 8, 2),
('Erling Haaland', 'Forward', 9, 27, 5, 2),
('Julián Álvarez', 'Forward', 19, 10, 6, 2);

INSERT INTO players (name, position, number, goalsScored, assists, team_id) VALUES
('Alisson Becker', 'Goalkeeper', 1, 0, 0, 3),
('Trent Alexander-Arnold', 'Defender', 66, 2, 10, 3),
('Virgil van Dijk', 'Defender', 4, 3, 1, 3),
('Ibrahima Konaté', 'Defender', 5, 1, 0, 3),
('Andrew Robertson', 'Defender', 26, 1, 5, 3),
('Alexis Mac Allister', 'Midfielder', 10, 4, 6, 3),
('Dominik Szoboszlai', 'Midfielder', 8, 5, 7, 3),
('Curtis Jones', 'Midfielder', 17, 3, 4, 3),
('Mohamed Salah', 'Forward', 11, 19, 10, 3),
('Darwin Núñez', 'Forward', 9, 12, 5, 3),
('Luis Díaz', 'Forward', 7, 8, 6, 3);

INSERT INTO players (name, position, number, goalsScored, assists, team_id) VALUES
('Robert Sánchez', 'Goalkeeper', 1, 0, 0, 4),
('Reece James', 'Defender', 24, 1, 3, 4),
('Thiago Silva', 'Defender', 6, 2, 0, 4),
('Benoît Badiashile', 'Defender', 5, 1, 1, 4),
('Ben Chilwell', 'Defender', 21, 2, 4, 4),
('Enzo Fernández', 'Midfielder', 8, 3, 5, 4),
('Moises Caicedo', 'Midfielder', 25, 1, 3, 4),
('Conor Gallagher', 'Midfielder', 23, 4, 6, 4),
('Cole Palmer', 'Forward', 20, 22, 11, 4),
('Nicolas Jackson', 'Forward', 15, 10, 3, 4),
('Raheem Sterling', 'Forward', 7, 7, 5, 4);

INSERT INTO players (name, position, number, goalsScored, assists, team_id) VALUES
('Guglielmo Vicario', 'Goalkeeper', 13, 0, 0, 5),
('Pedro Porro', 'Defender', 23, 2, 7, 5),
('Cristian Romero', 'Defender', 17, 4, 1, 5),
('Micky van de Ven', 'Defender', 37, 2, 0, 5),
('Destiny Udogie', 'Defender', 38, 2, 4, 5),
('Yves Bissouma', 'Midfielder', 8, 1, 1, 5),
('Pape Matar Sarr', 'Midfielder', 29, 3, 2, 5),
('James Maddison', 'Midfielder', 10, 4, 6, 5),
('Dejan Kulusevski', 'Forward', 21, 6, 3, 5),
('Heung-min Son', 'Forward', 7, 15, 9, 5),
('Richarlison', 'Forward', 9, 10, 4, 5);

INSERT INTO players (name, position, number, goalsScored, assists, team_id) VALUES
('André Onana', 'Goalkeeper', 24, 0, 0, 6),
('Diogo Dalot', 'Defender', 20, 1, 2, 6),
('Raphaël Varane', 'Defender', 19, 1, 0, 6),
('Lisandro Martínez', 'Defender', 6, 0, 1, 6),
('Luke Shaw', 'Defender', 23, 1, 3, 6),
('Casemiro', 'Midfielder', 18, 4, 2, 6),
('Bruno Fernandes', 'Midfielder', 8, 6, 7, 6),
('Christian Eriksen', 'Midfielder', 14, 2, 4, 6),
('Amad Diallo', 'Forward', 10, 8, 5, 6),
('Rasmus Højlund', 'Forward', 11, 7, 1, 6),
('Alejandro Garnacho', 'Forward', 17, 5, 4, 6);

INSERT INTO players (name, position, number, goalsScored, assists, team_id) VALUES
('Nick Pope', 'Goalkeeper', 22, 0, 0, 7),
('Kieran Trippier', 'Defender', 2, 1, 10, 7),
('Fabian Schär', 'Defender', 5, 3, 1, 7),
('Sven Botman', 'Defender', 4, 1, 0, 7),
('Dan Burn', 'Defender', 33, 2, 2, 7),
('Bruno Guimarães', 'Midfielder', 39, 4, 5, 7),
('Sean Longstaff', 'Midfielder', 36, 3, 3, 7),
('Joelinton', 'Midfielder', 7, 2, 2, 7),
('Anthony Gordon', 'Forward', 10, 8, 6, 7),
('Alexander Isak', 'Forward', 14, 14, 2, 7),
('Miguel Almirón', 'Forward', 24, 5, 3, 7);

INSERT INTO players (name, position, number, goalsScored, assists, team_id) VALUES
('Emiliano Martínez', 'Goalkeeper', 1, 0, 0, 8),
('Matty Cash', 'Defender', 2, 3, 1, 8),
('Ezri Konsa', 'Defender', 4, 1, 0, 8),
('Pau Torres', 'Defender', 14, 2, 1, 8),
('Lucas Digne', 'Defender', 12, 1, 4, 8),
('Douglas Luiz', 'Midfielder', 6, 7, 5, 8),
('John McGinn', 'Midfielder', 7, 3, 6, 8),
('Youri Tielemans', 'Midfielder', 8, 2, 4, 8),
('Leon Bailey', 'Forward', 31, 9, 6, 8),
('Ollie Watkins', 'Forward', 11, 18, 10, 8),
('Moussa Diaby', 'Forward', 19, 6, 5, 8);

INSERT INTO players (name, position, number, goalsScored, assists, team_id) VALUES
('Bart Verbruggen', 'Goalkeeper', 1, 0, 0, 9),
('Pervis Estupiñán', 'Defender', 30, 3, 5, 9),
('Lewis Dunk', 'Defender', 5, 2, 1, 9),
('Jan Paul van Hecke', 'Defender', 29, 1, 1, 9),
('Tariq Lamptey', 'Defender', 2, 0, 2, 9),
('Pascal Groß', 'Midfielder', 13, 4, 8, 9),
('Billy Gilmour', 'Midfielder', 27, 1, 2, 9),
('Carlos Baleba', 'Midfielder', 20, 0, 1, 9),
('Kaoru Mitoma', 'Forward', 22, 6, 7, 9),
('João Pedro', 'Forward', 9, 9, 2, 9),
('Danny Welbeck', 'Forward', 18, 5, 3, 9);

INSERT INTO players (name, position, number, goalsScored, assists, team_id) VALUES
('Alphonse Areola', 'Goalkeeper', 23, 0, 0, 10),
('Vladimír Coufal', 'Defender', 5, 0, 4, 10),
('Kurt Zouma', 'Defender', 4, 2, 0, 10),
('Nayef Aguerd', 'Defender', 27, 1, 0, 10),
('Emerson Palmieri', 'Defender', 33, 1, 2, 10),
('Tomáš Souček', 'Midfielder', 28, 4, 1, 10),
('James Ward-Prowse', 'Midfielder', 7, 6, 8, 10),
('Lucas Paquetá', 'Midfielder', 10, 5, 6, 10),
('Jarrod Bowen', 'Forward', 20, 14, 4, 10),
('Michail Antonio', 'Forward', 9, 5, 3, 10),
('Mohammed Kudus', 'Forward', 14, 8, 2, 10);

INSERT INTO players (name, position, number, goalsScored, assists, team_id) VALUES
('José Sá', 'Goalkeeper', 1, 0, 0, 11),
('Nelson Semedo', 'Defender', 22, 1, 2, 11),
('Craig Dawson', 'Defender', 15, 2, 0, 11),
('Max Kilman', 'Defender', 23, 1, 0, 11),
('Rayan Aït-Nouri', 'Defender', 3, 2, 3, 11),
('Mario Lemina', 'Midfielder', 5, 2, 1, 11),
('João Gomes', 'Midfielder', 8, 3, 2, 11),
('Matheus Cunha', 'Forward', 12, 8, 5, 11),
('Pedro Neto', 'Forward', 7, 4, 9, 11),
('Pablo Sarabia', 'Forward', 21, 3, 6, 11),
('Hee-chan Hwang', 'Forward', 11, 10, 3, 11);

INSERT INTO players (name, position, number, goalsScored, assists, team_id) VALUES
('Bernd Leno', 'Goalkeeper', 17, 0, 0, 12),
('Kenny Tete', 'Defender', 2, 1, 3, 12),
('Tim Ream', 'Defender', 13, 0, 1, 12),
('Issa Diop', 'Defender', 31, 2, 0, 12),
('Antonee Robinson', 'Defender', 33, 0, 5, 12),
('João Palhinha', 'Midfielder', 26, 3, 1, 12),
('Tom Cairney', 'Midfielder', 10, 2, 4, 12),
('Andreas Pereira', 'Midfielder', 18, 4, 6, 12),
('Willian', 'Forward', 20, 5, 3, 12),
('Rodrigo Muniz', 'Forward', 19, 7, 1, 12),
('Harry Wilson', 'Forward', 8, 4, 5, 12);

INSERT INTO players (name, position, number, goalsScored, assists, team_id) VALUES
('Sam Johnstone', 'Goalkeeper', 1, 0, 0, 13),
('Joel Ward', 'Defender', 2, 0, 1, 13),
('Joachim Andersen', 'Defender', 16, 2, 1, 13),
('Marc Guéhi', 'Defender', 6, 0, 0, 13),
('Tyrick Mitchell', 'Defender', 3, 1, 2, 13),
('Jeffrey Schlupp', 'Midfielder', 15, 3, 2, 13),
('Will Hughes', 'Midfielder', 19, 2, 1, 13),
('Eberechi Eze', 'Midfielder', 10, 6, 5, 13),
('Michael Olise', 'Forward', 7, 5, 4, 13),
('Jean-Philippe Mateta', 'Forward', 14, 8, 2, 13),
('Jordan Ayew', 'Forward', 9, 3, 6, 13);

INSERT INTO players (name, position, number, goalsScored, assists, team_id) VALUES
('Mark Flekken', 'Goalkeeper', 1, 0, 0, 14),
('Aaron Hickey', 'Defender', 2, 1, 1, 14),
('Ethan Pinnock', 'Defender', 5, 2, 0, 14),
('Ben Mee', 'Defender', 16, 1, 0, 14),
('Rico Henry', 'Defender', 3, 0, 2, 14),
('Christian Nørgaard', 'Midfielder', 6, 1, 3, 14),
('Mathias Jensen', 'Midfielder', 8, 3, 5, 14),
('Vitaly Janelt', 'Midfielder', 27, 2, 3, 14),
('Bryan Mbeumo', 'Forward', 19, 9, 6, 14),
('Yoane Wissa', 'Forward', 11, 6, 4, 14),
('Neal Maupay', 'Forward', 7, 5, 2, 14);

INSERT INTO players (name, position, number, goalsScored, assists, team_id) VALUES
('Neto', 'Goalkeeper', 1, 0, 0, 15),
('Adam Smith', 'Defender', 15, 0, 1, 15),
('Chris Mepham', 'Defender', 6, 1, 0, 15),
('Lloyd Kelly', 'Defender', 5, 0, 1, 15),
('Milos Kerkez', 'Defender', 3, 0, 2, 15),
('Lewis Cook', 'Midfielder', 4, 1, 3, 15),
('Ryan Christie', 'Midfielder', 10, 3, 5, 15),
('Philip Billing', 'Midfielder', 29, 4, 2, 15),
('Justin Kluivert', 'Forward', 19, 6, 2, 15),
('Dominic Solanke', 'Forward', 9, 16, 4, 15),
('Antoine Semenyo', 'Forward', 24, 5, 3, 15);

INSERT INTO players (name, position, number, goalsScored, assists, team_id) VALUES
('Matt Turner', 'Goalkeeper', 1, 0, 0, 16),
('Serge Aurier', 'Defender', 24, 0, 2, 16),
('Willy Boly', 'Defender', 30, 1, 0, 16),
('Joe Worrall', 'Defender', 4, 0, 0, 16),
('Nuno Tavares', 'Defender', 3, 1, 0, 16),
('Orel Mangala', 'Midfielder', 5, 2, 3, 16),
('Ryan Yates', 'Midfielder', 22, 1, 2, 16),
('Morgan Gibbs-White', 'Midfielder', 10, 5, 7, 16),
('Anthony Elanga', 'Forward', 21, 4, 6, 16),
('Taiwo Awoniyi', 'Forward', 9, 6, 3, 16),
('Callum Hudson-Odoi', 'Forward', 14, 3, 2, 16);

INSERT INTO players (name, position, number, goalsScored, assists, team_id) VALUES
('Alex Palmer', 'Goalkeeper', 31, 0, 0, 17),
('Ben Johnson', 'Defender', 18, 1, 2, 17),
('Luke Woolfenden', 'Defender', 6, 0, 0, 17),
('Cameron Burgess', 'Defender', 15, 0, 1, 17),
('Leif Davis', 'Defender', 3, 1, 2, 17),
('Sam Morsy', 'Midfielder', 5, 1, 1, 17),
('Jack Taylor', 'Midfielder', 14, 1, 0, 17),
('Omari Hutchinson', 'Forward', 20, 3, 2, 17),
('Sam Szmodics', 'Midfielder', 23, 4, 0, 17),
('Jaden Philogene', 'Forward', 29, 0, 0, 17),
('Liam Delap', 'Forward', 19, 12, 2, 17);

INSERT INTO players (name, position, number, goalsScored, assists, team_id) VALUES
('Wes Foderingham', 'Goalkeeper', 18, 0, 0, 18),
('George Baldock', 'Defender', 2, 0, 1, 18),
('Anel Ahmedhodžić', 'Defender', 15, 2, 1, 18),
('Jack Robinson', 'Defender', 19, 1, 0, 18),
('Max Lowe', 'Defender', 3, 0, 1, 18),
('Vinicius Souza', 'Midfielder', 21, 1, 2, 18),
('Gustavo Hamer', 'Midfielder', 8, 4, 3, 18),
('James McAtee', 'Midfielder', 28, 3, 3, 18),
('Oliver McBurnie', 'Forward', 9, 5, 1, 18),
('Ben Brereton Díaz', 'Forward', 11, 4, 2, 18),
('Cameron Archer', 'Forward', 10, 6, 1, 18);

INSERT INTO players (name, position, number, goalsScored, assists, team_id) VALUES
('Mads Hermansen', 'Goalkeeper', 30, 0, 0, 19),
('James Justin', 'Defender', 2, 2, 1, 19),
('Wout Faes', 'Defender', 3, 1, 0, 19),
('Jannik Vestergaard', 'Defender', 23, 2, 0, 19),
('Victor Kristiansen', 'Defender', 16, 0, 1, 19),
('Harry Winks', 'Midfielder', 8, 2, 0, 19),
('Wilfred Ndidi', 'Midfielder', 6, 17, 0, 19),
('Bilal El Khannouss', 'Midfielder', 11, 0, 0, 19),
('Abdul Fatawu', 'Forward', 7, 7, 0, 19),
('Jamie Vardy', 'Forward', 9, 8, 3, 19),
('Stephy Mavididi', 'Forward', 10, 13, 0, 19);

INSERT INTO players (name, position, number, goalsScored, assists, team_id) VALUES
('Jordan Pickford', 'Goalkeeper', 1, 0, 0, 20),
('Ashley Young', 'Defender', 18, 1, 2, 20),
('James Tarkowski', 'Defender', 6, 2, 2, 20),
('Jarrad Branthwaite', 'Defender', 32, 2, 0, 20),
('Vitaliy Mykolenko', 'Defender', 19, 2, 1, 20),
('Amadou Onana', 'Midfielder', 8, 1, 2, 20),
('Idrissa Gueye', 'Midfielder', 27, 1, 1, 20),
('Dwight McNeil', 'Midfielder', 7, 4, 4, 20),
('Abdoulaye Doucouré', 'Midfielder', 16, 6, 3, 20),
('Dominic Calvert-Lewin', 'Forward', 9, 5, 1, 20),
('Jack Harrison', 'Forward', 11, 3, 5, 20);

CREATE TABLE matches (
     id INT AUTO_INCREMENT PRIMARY KEY,
     date DATE,
     home_team_id INT NOT NULL,
     away_team_id INT NOT NULL,
     homeTeamScore INT NOT NULL DEFAULT 0,
     awayTeamScore INT NOT NULL DEFAULT 0,
     status ENUM('upcoming', 'ongoing', 'finished') NOT NULL DEFAULT 'upcoming',
     FOREIGN KEY (home_team_id) REFERENCES teams(id),
     FOREIGN KEY (away_team_id) REFERENCES teams(id)
);

INSERT INTO matches (date, home_team_id, away_team_id, homeTeamScore, awayTeamScore, status) VALUES
('2023-08-15', 1, 2, 2, 1, 'finished'),
('2023-08-22', 1, 3, 1, 1, 'finished'),
('2023-08-29', 1, 4, 0, 2, 'finished'),
('2023-09-05', 1, 5, 3, 1, 'finished'),
('2023-09-12', 1, 6, 1, 1, 'finished'),
('2023-09-19', 1, 7, 2, 0, 'finished'),
('2023-09-26', 1, 8, 1, 0, 'ongoing'),
('2023-10-03', 1, 9, 0, 1, 'ongoing'),
('2023-10-10', 1, 10, 0, 0, 'ongoing'),
('2023-10-17', 1, 11, 2, 2, 'ongoing'),
('2023-10-24', 1, 12, 0, 0, 'upcoming'),
('2023-10-31', 2, 3, 0, 0, 'upcoming'),
('2023-11-07', 4, 1, 0, 0, 'upcoming'),
('2023-11-14', 5, 6, 0, 0, 'upcoming'),
('2023-11-21', 7, 8, 0, 0, 'upcoming'),
('2023-11-28', 9, 10, 0, 0, 'upcoming'),
('2023-12-05', 11, 1, 0, 0, 'upcoming');

CREATE TABLE users (
    id INT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    balance FLOAT NOT NULL DEFAULT 0
);

INSERT INTO users (id, username, password, role, balance) VALUES
(1, 'admin', '$2b$10$MJcEDnUrzwQ.o57KDkUITeo.oA6bOdTWYPEl/dAI9v104inR2vTcy', 'admin',0),
(2, 'user', '$2b$10$QrE65GCJ2FWdA07NCPoaR.hMvdXj6Pt9Cktwt431PVcxGiuAJdHE.', 'user', 0);

CREATE TABLE odds (
  match_id INT PRIMARY KEY,
  home_win DECIMAL(4,2) NOT NULL,
  draw DECIMAL(4,2) NOT NULL,
  away_win DECIMAL(4,2) NOT NULL,
  FOREIGN KEY (match_id) REFERENCES matches(id)
);

INSERT INTO odds (match_id, home_win, draw, away_win) VALUES
  (7, 1.70, 3.60, 4.10),
  (8, 1.55, 3.90, 4.80),
  (9, 1.50, 4.00, 5.00),
  (10, 1.65, 3.70, 4.50),
  (11, 1.95, 3.30, 3.90),
  (12, 2.00, 3.40, 3.60),
  (13, 2.10, 3.10, 3.30),
  (14, 2.30, 3.20, 3.00),
  (15, 2.40, 3.00, 2.90),
  (16, 2.20, 3.50, 2.80),
  (17, 2.00, 3.60, 3.10);

CREATE TABLE bets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  match_id INT NOT NULL,
  bet_type ENUM('home_win', 'draw', 'away_win') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  odds_at_bet_time DECIMAL(4,2) NOT NULL,
  status ENUM('pending', 'won', 'lost') DEFAULT 'pending',
  date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (match_id) REFERENCES matches(id)
);