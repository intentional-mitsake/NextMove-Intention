# NextMove-Intention

A fast-paced 2-player chess game where one player moves, and the other fights the clock to figure it out. 

The concept is simple: a random position is generated. **Player 1** selects the "best" move. **Player 2** has a ticking timer to guess exactly what that move was.

---

##  Game Rules & Structure

A single match consists of **10 rounds** featuring completely unique, random board positions.
* **Balanced Play:** Roles swap every round. Each player gets **5 rounds as the Setter** and **5 rounds as the Guesser**.
* **The Goal:** Accumulate the highest total score by the end of the 10th round.

###  Asymmetric Roles

* **The Setter:** Analyzes the random position and commits to a single legal move. They are incentivized to find objectively strong moves, as engine evaluations dictate their points.
* **The Guesser:** Races against a ticking timer to read the Setter's mind. They don't just need to find the *best* move—they need to find the move *the Setter actually made*.

---

## Scoring System

Points are dynamically awarded based on engine evaluation (for the Setter) and precision/accuracy (for the Guesser).

###  The Setter's Scoring
The Setter's points depend entirely on the quality of their chosen move, evaluated by an integrated chess engine:

| Move Quality | Points | Description |
| :--- | :---: | :--- |
| **Best Move** | `+5` | The absolute optimal engine move. |
| **Great Move**| `+3` | A strong tactical choice or the second-best option. |
| **Book Move** | `0` | Standard theoretical play; safe but uninspired. |
| **Mistake** | `-3` | A sub-optimal move that drops a slight advantage. |
| **Blunder** | `-5` | A critical error that severely compromises the position. |

### ⏱️ The Guesser's Scoring
The Guesser's points depend on how close their guess is to the Setter's actual move before the timer hits zero:

| Guess Accuracy | Points | Condition |
| :--- | :---: | :--- |
| **Exact Match** | `+5` | Guessed the exact starting square and destination square. |
| **Partial Match**| `+3` | Guessed the **Correct Piece** OR the **Correct Destination Square**. |
| **Wrong Guess** | `-8` | Completely missed both the piece and the destination, or ran out of time. |

---
## Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript 
* **Chess Logic:** [Chess.js](https://github.com/jhlywa/chess.js) (for move validation)
* **Backend:** Node.js with WebSockets (Socket.io) for real-time player interaction.

---
