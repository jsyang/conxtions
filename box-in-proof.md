# Connections Board Game: Box-In Geometric Proof

![](connections-retail.png)

## Basic game rules

Connections is a 2 player turn based board game played on a board with rows of fixed square tiles of alternating between the two player colors: red and white. The first row of squares is white, second is red, and so forth. The eleventh row is the final row, its color is white. 

The squares on a row have a 1 tile gap between them in which a player can drop a line tile. All rows are separated vertically by a gap of 1 tile. See this illustration of the initial  game board:

![](initialboard.png)

There are no square tiles at the four corners of the game board.

### Making moves

During a turn, a player use a line tile (horizontally or vertically) to connect exactly two squares of their color. Once a position is played, it cannot accept any more tiles, i.e. no stacking or replacement.

### Winning

1. "Link-Up": The first way a game can be won is when a player has joined a square from the row closest to them to the farther row to them. The easiest way to detect this type of win is to check all of a player's paths for a point that lies both on the top and bottom rows. We can do this with a simple depth-first search (DFS) from square tiles of the top row.

![](examples-link-up.png)

2. "Box-In": The second way a game is won happens when a player has formed a closed loop around one or more square tiles of the opponent's color. This can also be found via DFS but since a Box-In can occur anywhere on the board, a naive implementation may be very inefficient.

![](examples-box-in.png)

The aim of this proof is to establish that a Box-In win occurs when a player has created a figure on the board where the number of square tiles (V for vertex) equals the number of line tiles (E for edge).

```

    Within a figure on the board,
    V = E if and only if this figure wins the game via Box-In

```

## Proof

We'll start off with some simple figures and build up from here.

### Types of square tiles

A Leaf square connects to 1 other square. There are 4 possible orientations.

![](leaf-orientations.png)

A Stem square connects to 2 other squares. There are 6 possible orientations.

![](stem-orientations.png)

A Fork square connects to 3 other squares. There are 4 possible orientations.

![](fork-orientations.png)

A Star square connects to 4 other squares. There is only 1 possible orientation.

![](star-orientation.png)

## 1. Proof: Only 1 closed path allowed for any end game state

## 2. Proof: Any simple closed path satisfies V = E

## 3. Proof: Any simple open path satisfies V - E = 1

## 4. Proof: Any open path can be composed of any simple open path joined to another open path and still satisfies V - E = 1

## 5. Proof: Any closed path can be composed of any simple closed path joined to any open path and still satisfies V = E

# Conclusion: Any winning path will satisfy V = E, and therefore it must contain a simple closed path 
