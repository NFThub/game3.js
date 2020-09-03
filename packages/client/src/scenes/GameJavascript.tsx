import React, {Component, createContext} from 'react';
import {updateSessionScore, updateGameNo, createSessionId, makeNewGameSession} from '../helpers/database';
import { navigateTo } from '../helpers/utilities'

export const GameJavascriptContext = createContext(
  {
    updateSessionHighScore: (x: any, y:any, z:any) => {},
    updateGameNo: (x: any, y:any, z:any) => {},
    isPlayerDead: '',
    isGameRunning: '',
    sessionId: '0',
    playerIsDead: (x:boolean) => {},
    gameIsRunning: (x:boolean) => {},
    initiateGame: (x:any) => {}
  });

export default class GameJavascript extends Component<any, any> {

  constructor(props) {
    super(props);

    this.state = {
      isPlayerDead: false,
      isGameRunning: true,
      sessionId: '0'
    }
    this.playerIsDead = this.playerIsDead.bind(this);
    this.gameIsRunning = this.gameIsRunning.bind(this);
    this.setSessionId = this.setSessionId.bind(this);
    this.initiateGame = this.initiateGame.bind(this);
  }

  async updateSessionHighScore(sessionId: any, playerAddress: any, tournamentId: any) {
    let updatedData = await updateSessionScore(sessionId, playerAddress, tournamentId);
    console.log("Data updated with", updatedData);

    // navigate to home for now
    navigateTo('/');
  }

  async updateGameNo(sessionId: any, playerAddress: any, tournamentId: any) {
    console.log("GAME JAVASCRIPT: UpdateGameNumber")
    await updateGameNo(sessionId, playerAddress, tournamentId);
  }

  playerIsDead(isDead) {
    console.log("GAME JAVASCRIPT: PlayerIsDead")
    this.setState({
      isPlayerDead: isDead
    })
  }

  gameIsRunning(isRunning) {
    console.log("GAME JAVASCRIPT: PlayerIsDead")
    this.setState({
      isGameRunning: isRunning
    })
  }

  async setSessionId(playerAddress, tournamentId) {
    console.log("GAME JAVASCRIPT: setSessionId")
    let sessionId = await createSessionId(playerAddress, tournamentId);
    this.setState({
      sessionId
    })
  }

  async initiateGame(params: any) {
    console.log("GAME JAVASCRIPT: Initiate Game")
    const { playerAddress, tournamentId, isDead, isGameRunning, players, endsAt} = params;
    await this.setSessionId(playerAddress, tournamentId);
    await makeNewGameSession(playerAddress, tournamentId, players, endsAt)
    await this.updateGameNo(this.state.sessionId, playerAddress, tournamentId);
    this.gameIsRunning(isGameRunning);
    this.playerIsDead(isDead);
  }

  render() {
    return (
      <GameJavascriptContext.Provider value={
        {
          updateSessionHighScore: this.updateSessionHighScore,
          updateGameNo: this.updateGameNo,
          isPlayerDead: this.state.isPlayerDead,
          isGameRunning: this.state.isGameRunning,
          sessionId: this.state.sessionId,
          playerIsDead: this.playerIsDead,
          gameIsRunning: this.gameIsRunning,
          initiateGame: this.initiateGame
        }
      }>
        {this.props.children}
      </GameJavascriptContext.Provider>
    )
  }
}