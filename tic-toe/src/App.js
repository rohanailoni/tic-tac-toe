import logo from './logo.svg';
import './App.css';
import Square from './components/Square';
import {useState,useEffect} from 'react';
import {Patterns} from './Patterns';
import { useCookies } from "react-cookie";
import Username from './components/Username';
const ws=new WebSocket("ws://localhost:8000/ws/chat/roomname/")
function App() {
  const [board,setboard]=useState(["","","","","","","","",""]);
  const [player,setplayer]=useState("X");
  const [result, setResult] = useState({ winner: "none", state: "none" });
  const [cookies, setCookie,removeCookie] = useCookies(["user"]);
  const [touch,settouch]=useState("none");
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
    var open_req={
      'action':'fetch_info',

    }
    ws.send(JSON.stringify(open_req));
    console.log('connected');
    };
  ws.onmessage=evt=>{
    console.log(evt)
    const message=JSON.parse(evt.data);
    if(message['action']==="start_everyone_is_ready"){
        setplayer(message['Icon'])
        if(message['status']==="ON"){
          settouch("auto");
        }else if(message['status']==="OFF"){
          settouch("none");
        }

    }
    else if(message['action']==="No_new_users_yet"){
          settouch("none");

    }
    else if(message['action']==="More than 2 members connected to a room"){
      settouch("none");
    }
    else if(message['action']==='sync_switch'){
      if(JSON.stringify(board)===JSON.stringify(message['board'])){
        return;
      }
      setboard(message['board']);
      settouch("auto");
    }
  }
  async function sync_handler(){
    await ws.send(JSON.stringify({
      'action':'sync_switch',
      'board':board,
      

    }));
  }
  //runs when ever the board is changed
  useEffect(() => {
    checkWin();
    checkIfTie();
   sync_handler()
    // if (player === "X") {
    //   setplayer("O");
    // } else {
    //   setplayer("X");
    // }
  }, [board]);
  //runs whenever result is changed
  useEffect(() => {
    if (result.state !== "none") {
      alert(`Game Finished! Winning Player: ${result.winner}`);
      ws.send(JSON.stringify({'message':"you are actually out"}));
      restartGame();
    }
  }, [result]);
  //function to check if the person is win
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
  //check if the person is tie
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
  //funciton to restat the game if it restart
  const restartGame = () => {
    setboard(["", "", "", "", "", "", "", "", ""]);
    setplayer("O");
  };
  return (
    <div className="App">
      {/* <Username cookies={cookies} setCookie={setCookie} removeCookie={removeCookie}/> */}
      
      <div className="board">
        <div className='row'>
          <Square val={board[0]} choosesquare={()=>{choosesquare(0)}} touch={touch}/>
          <Square val={board[1]} choosesquare={()=>{choosesquare(1)}} touch={touch}/>
          <Square val={board[2]} choosesquare={()=>{choosesquare(2)}} touch={touch}/>
        </div>
        <div className='row'>
        <Square val={board[3]} choosesquare={()=>{choosesquare(3)}} touch={touch}/>
          <Square val={board[4]} choosesquare={()=>{choosesquare(4)}} touch={touch}/>
          <Square val={board[5]} choosesquare={()=>{choosesquare(5)}} touch={touch}/>

        </div>
        <div className='row'>
           <Square val={board[6]} choosesquare={()=>{choosesquare(6)}} touch={touch}/>
          <Square val={board[7]} choosesquare={()=>{choosesquare(7)}} touch={touch}/>
          <Square val={board[8]} choosesquare={()=>{choosesquare(8)}} touch={touch}/>
        </div>
      </div>
    </div>
  );
}

export default App;
