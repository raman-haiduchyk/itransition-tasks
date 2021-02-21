using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using task_6.Models;

namespace task_6
{
    public class HubState
    {

        private readonly static Lazy<HubState> instance = new Lazy<HubState>(
            () => new HubState(GlobalHost.ConnectionManager.GetHubContext<GameHub>())
        );


        private readonly ConcurrentDictionary<string, Player> players =
            new ConcurrentDictionary<string, Player>(StringComparer.OrdinalIgnoreCase);


        private readonly ConcurrentDictionary<string, Game> games =
            new ConcurrentDictionary<string, Game>(StringComparer.OrdinalIgnoreCase);

        private readonly ConcurrentQueue<Player> waitingPlayers =
            new ConcurrentQueue<Player>();

        private readonly ConcurrentDictionary<string, Player> waitingForGame =
            new ConcurrentDictionary<string, Player>(StringComparer.OrdinalIgnoreCase);

        private HubState(IHubContext context)
        {
            this.Clients = context.Clients;
            this.Groups = context.Groups;
        }

        public static HubState Instance
        {
            get { return instance.Value; }
        }

        public IHubConnectionContext<dynamic> Clients { get; set; }

        public IGroupManager Groups { get; set; }


        public List<Player> GetWaitingPlayers()
        {
            List<Player> players = new List<Player>();
            foreach(var element in waitingForGame.AsEnumerable())
            {
                players.Add(element.Value);
            }
            return players;
        }

        public Player CreatePlayer(string connectionId)
        {
            var player = new Player(connectionId);
            players[connectionId] = player;

            return player;
        }

        public Player CreatePlayer(string connectionId, string gameName)
        {
            var player = new Player(connectionId, gameName);
            players[connectionId] = player;

            return player;
        }

        public Player GetPlayer(string playerId)
        {
            Player foundPlayer;
            if (!players.TryGetValue(playerId, out foundPlayer))
            {
                return null;
            }
            return foundPlayer;
        }


        public Game GetGame(Player player, out Player opponent)
        {
            opponent = null;
            Game foundGame = games.Values.FirstOrDefault(g => g.Id == player.GameId);

            if (foundGame == null)
            {
                return null;
            }
            opponent = (player.Id == foundGame.Player1.Id) 
                ? foundGame.Player2 
                : foundGame.Player1;

            return foundGame;
        }

        public Player GetWaitingOpponent()
        {
            Player foundPlayer;
            if (!waitingPlayers.TryDequeue(out foundPlayer))
            {
                return null;
            }

            return foundPlayer;
        }

        public void RemoveGame(string gameId)
        {
            // Remove the game
            Game foundGame;
            if (!games.TryRemove(gameId, out foundGame))
            {
                throw new InvalidOperationException("Game not found.");
            }

            Player foundPlayer;
            players.TryRemove(foundGame.Player1.Id, out foundPlayer);
            players.TryRemove(foundGame.Player2.Id, out foundPlayer);
        }

        public void AddToWaitingPool(Player player)
        {
            waitingPlayers.Enqueue(player);
        }

        public void AddToWaitingList(Player joiningPlayer)
        {
            waitingForGame.TryAdd(joiningPlayer.Id, joiningPlayer);
        }

        public bool IsUsernameTaken(string id)
        {
            return players.Values.FirstOrDefault(player => player.Id.Equals(id, StringComparison.InvariantCultureIgnoreCase)) != null;
        }


        public async Task<Game> CreateGame(Player firstPlayer, Player secondPlayer)
        {
            // Define the new game and add to waiting pool
            Game game = new Game(firstPlayer, secondPlayer);
            this.games[game.Id] = game;

            // Create a new group to manage communication using ID as group name
            await this.Groups.Add(firstPlayer.Id, groupName: game.Id);
            await this.Groups.Add(secondPlayer.Id, groupName: game.Id);

            return game;
        }

    }
}