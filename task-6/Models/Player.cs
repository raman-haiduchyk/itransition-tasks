using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace task_6.Models
{
    public class Player
    {
        public Player(string id)
        {
            this.Id = id;
        }

        public string Id { get; private set; }

        public string GameId { get; set; }

        public string Piece { get; set; }

        public override string ToString()
        {
            return String.Format("(Id={0}, GameId={1}, Piece={2})",
                this.Id, this.GameId, this.Piece);
        }

        public override bool Equals(object obj)
        {
            Player other = obj as Player;

            if (other == null)
            {
                return false;
            }

            return this.Id.Equals(other.Id);
        }

        public override int GetHashCode()
        {
            return this.Id.GetHashCode();
        }
    }
}