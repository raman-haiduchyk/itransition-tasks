using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace task_6.Models
{
    public class Game
    {
        private bool isFirstPlayersTurn;

        public Game(Player player1, Player player2)
        {
            Player1 = player1;
            Player2 = player2;
            Id = Guid.NewGuid().ToString("d");
            Board = new Board();

            isFirstPlayersTurn = true;


            Player1.GameId = Id;
            Player2.GameId = Id;


            Player1.Piece = "X";
            Player2.Piece = "O";

        }

        public string Id { get; set; }


        public Player Player1 { get; set; }

        public Player Player2 { get; set; }

        public Board Board { get; set; }

        public Player WhoseTurn
        {
            get
            {
                return (this.isFirstPlayersTurn)
                    ? Player1
                    : Player2;
            }
        }

        public bool IsOver
        {
            get
            {
                return (!Board.AreSpacesLeft()) || Board.IsThreeInRow();
            }
            
        }

        public bool IsTie()
        {
            return !Board.AreSpacesLeft();
            
        }

        public void PlacePiece(int row, int col)
        {
            string pieceToPlace = isFirstPlayersTurn 
                ? Player1.Piece 
                : Player2.Piece;

            Board.PlacePiece(row, col, pieceToPlace);

            isFirstPlayersTurn = !isFirstPlayersTurn;
        }

        public bool IsValidMove(int row, int col)
        {
            return
                row < Board.Pieces.GetLength(0) &&
                col < Board.Pieces.GetLength(1) &&
                string.IsNullOrWhiteSpace(Board.Pieces[row, col]);
        }

        public override string ToString()
        {
            return String.Format("(Id={0}, Player1={1}, Player2={2}, Board={3})",
                Id, Player1, Player2, Board);
        }
    }
}