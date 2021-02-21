using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using task_6.Models;

namespace task_6
{
    public class GameHub : Hub
    {

        public void CreateGame(string name)
        {
            Player joiningPlayer = HubState.Instance.CreatePlayer(Context.ConnectionId, name);
            HubState.Instance.AddToWaitingList(joiningPlayer);
            Clients.Caller.waitingList();
        }

        public void AddGameTag(string tag)
        {
            Player player = HubState.Instance.GetPlayer(Context.ConnectionId);
            if (player != null) player.AddTag(tag);
        }

        public void WaitForOpponent()
        {
        }

        public void JoinGame(string waitingPlayerId)
        {
        }


        public async Task FindGame()
        {
            if (HubState.Instance.IsUsernameTaken(this.Context.ConnectionId))
            {
                this.Clients.Caller.usernameTaken();
                return;
            }

            Player joiningPlayer =
                HubState.Instance.CreatePlayer(this.Context.ConnectionId);
            this.Clients.Caller.playerJoined(joiningPlayer);

            // Find any pending games if any
            Player opponent = HubState.Instance.GetWaitingOpponent();
            if (opponent == null)
            {
                // No waiting players so enter the waiting pool
                HubState.Instance.AddToWaitingPool(joiningPlayer);
                this.Clients.Caller.waitingList();
            }
            else
            {
                // An opponent was found so join a new game and start the game
                // Opponent is first player since they were waiting first
                Game newGame = await HubState.Instance.CreateGame(opponent, joiningPlayer);
                Clients.Group(newGame.Id).start(newGame);
            }
        }




        public void PlacePiece(int row, int col)
        {
            Player playerMakingTurn = HubState.Instance.GetPlayer(playerId: this.Context.ConnectionId);
            Player opponent;
            Game game = HubState.Instance.GetGame(playerMakingTurn, out opponent);

            // TODO: should the game check if it is the players turn?
            if (game == null || !game.WhoseTurn.Equals(playerMakingTurn))
            {
                this.Clients.Caller.notPlayersTurn();
                return;
            }

            if (!game.IsValidMove(row, col))
            {
                this.Clients.Caller.notValidMove();
                return;
            }

            // Notify everyone of the valid move. Only send what is necessary (instead of sending whole board)
            game.PlacePiece(row, col);
            this.Clients.Group(game.Id).piecePlaced(row, col, playerMakingTurn.Piece);

            // check if game is over (won or tie)
            if (!game.IsOver)
            {
                // Update the turn like normal if the game is still ongoing
                this.Clients.Group(game.Id).updateTurn(game);
            }
            else
            {
                // Determine how the game is over in order to display correct message to client
                if (game.IsTie())
                {
                    // Cat's game
                    this.Clients.Group(game.Id).tieGame();
                }
                else
                {
                    // Player outright won
                    this.Clients.Group(game.Id).winner(playerMakingTurn.Id);
                }

                // Remove the game (in any game over scenario) to reclaim resources
                HubState.Instance.RemoveGame(game.Id);
            }
        }

        public override async Task OnDisconnected(bool stopCalled)
        {
            Player leavingPlayer = HubState.Instance.GetPlayer(playerId: this.Context.ConnectionId);

            // Only handle cases where user was a player in a game or waiting for an opponent
            if (leavingPlayer != null)
            {
                Player opponent;
                Game ongoingGame = HubState.Instance.GetGame(leavingPlayer, out opponent);
                if (ongoingGame != null)
                {
                    this.Clients.Group(ongoingGame.Id).opponentLeft();
                    HubState.Instance.RemoveGame(ongoingGame.Id);
                }
            }

            await base.OnDisconnected(stopCalled);
        }

        public async override Task OnConnected()
        {
            Clients.Caller.showGames(HubState.Instance.GetWaitingPlayers());
            await base.OnConnected();
        }

    }
}