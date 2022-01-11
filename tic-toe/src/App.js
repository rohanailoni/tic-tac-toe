import logo from './logo.svg';
import './App.css';
import Square from './components/Square';
import {useState,useEffect} from 'react';
import {Patterns} from './Patterns';
const ws = new WebSocket('ws://localhost:8000/ws/chat/rohan');
function App() {
  const [board,setboard]=useState(["","","","","","","","",""]);
  const [player,setplayer]=useState("X");
  const [result, setResult] = useState({ winner: "none", state: "none" });
  
  const choosesquare=(square)=>{
    setboard(board.map((val,idx)=>{
      if(idx===square && val===""){
        return player;
      }
      return val;
    }))
    
    
  };
  ws.onopen = () => {
    // on connecting, do nothing but log it to the console
    console.log('connected')
    };
  
  

  useEffect(() => {
    checkWin();
    checkIfTie();

    if (player === "X") {
      setplayer("O");
    } else {
      setplayer("X");
    }
  }, [board]);

  useEffect(() => {
    if (result.state !== "none") {
      alert(`Game Finished! Winning Player: ${result.winner}`);
      ws.send(JSON.stringify({'message':"you are actually out"}));
      restartGame();
    }
  }, [result]);
  const checkWin = () => {
    Patterns.forEach((currPattern) => {
      const firstPlayer = board[currPattern[0]];
      if (firstPlayer === "") return;
      let foundWinningPattern = true;
      currPattern.forEach((idx) => {
        if (board[idx] !== firstPlayer) {
          foundWinningPattern = false;
        }
      });

      if (foundWinningPattern) {
        setResult({ winner: player, state: "Won" });
      }
    });
  };

  const checkIfTie = () => {
    let filled = true;
    board.forEach((square) => {
      if (square === "") {
        filled = false;
      }
    });

    if (filled) {
      setResult({ winner: "No One", state: "Tie" });
    }
  };
  const restartGame = () => {
    setboard(["", "", "", "", "", "", "", "", ""]);
    setplayer("O");
  };
  return (
    <div className="App">
      <div className="board">
        <div className='row'>
          <Square val={board[0]} choosesquare={()=>{choosesquare(0)}}/>
          <Square val={board[1]} choosesquare={()=>{choosesquare(1)}}/>
          <Square val={board[2]} choosesquare={()=>{choosesquare(2)}}/>
        </div>
        <div className='row'>
        <Square val={board[3]} choosesquare={()=>{choosesquare(3)}}/>
          <Square val={board[4]} choosesquare={()=>{choosesquare(4)}}/>
          <Square val={board[5]} choosesquare={()=>{choosesquare(5)}}/>

        </div>
        <div className='row'>
           <Square val={board[6]} choosesquare={()=>{choosesquare(6)}}/>
          <Square val={board[7]} choosesquare={()=>{choosesquare(7)}}/>
          <Square val={board[8]} choosesquare={()=>{choosesquare(8)}}/>
        </div>
      </div>
    </div>
  );
}

export default App;
