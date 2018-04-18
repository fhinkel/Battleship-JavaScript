const express = require('express');

const path = require('path')

const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const ID = Math.floor(Math.random() * 1000);
app.use(express.static(path.join(__dirname, 'public')))

app.get('/hello', (req, res) => {
  res.status(200).send('Hello, world! This is robot #' + ID + '.').end();
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('fireTorpedo', function(id) {
        // extract row and column # from the HTML element's id
		var row = id.substring(1,2);
		var col = id.substring(2,3);
        console.log("Clicked on row " + row + ", col " + col);
				
		// if player clicks a square with no ship, change the color and change square's value
		if (gameBoard[row][col] == 0 || gameBoard[row][col] == 3) {
            socket.emit('miss', id);
			// set this square's value to 3 to indicate that they fired and missed
			gameBoard[row][col] = 3;
			
		// if player clicks a square with a ship, change the color and change square's value
		} else if (gameBoard[row][col] == 1 || gameBoard[row][col] == 2) {
            socket.emit('hit', id)
			// set this square's value to 2 to indicate the ship has been hit
			gameBoard[row][col] = 2;
			
			// increment hitCount each time a ship is hit
			hitCount++;
			// this definitely shouldn't be hard-coded, but here it is anyway. lazy, simple solution:
			if (hitCount == 17) {
				socket.emit('win')
			}
		}		
    })
});

/* lazy way of tracking when the game is won: just increment hitCount on every hit
   in this version, and according to the official Hasbro rules (http://www.hasbro.com/common/instruct/BattleShip_(2002).PDF)
   there are 17 hits to be made in order to win the game:
      Carrier     - 5 hits
      Battleship  - 4 hits
      Destroyer   - 3 hits
      Submarine   - 3 hits
      Patrol Boat - 2 hits
*/
var hitCount = 0;

/* create the 2d array that will contain the status of each square on the board
   and place ships on the board (later, create function for random placement!)

   0 = empty, 1 = part of a ship, 2 = a sunken part of a ship, 3 = a missed shot
*/
var gameBoard = [
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0],
    [0,0,0,0,0,0,1,0,0,0],
    [1,0,0,0,0,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0],
    [1,0,0,1,0,0,0,0,0,0],
    [1,0,0,1,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0]
    ]




// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});