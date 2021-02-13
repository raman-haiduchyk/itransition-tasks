using System;
using System.Security.Cryptography;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace Task_3
{
    class Program
    {
        static void Main(string[] args)
        {
            //List<string> moves = new List<string>() { "Rock", "Paper", "Scissors", "Lizard", "Spoke" };
            List<string> moves = new List<string>(args);
            if (CheckCommandLineArgs(moves))
            {
                RandomNumberGenerator rng = RandomNumberGenerator.Create();
                HMACSHA256 hmac = new HMACSHA256();
                int compMove, userMove;
                byte[] hmacBytes, key = new byte[16];
                do
                {
                    rng.GetBytes(key);
                    hmac.Key = key;
                    compMove = RandomNumberGenerator.GetInt32(0, moves.Count);
                    hmacBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(moves[compMove]));

                    Console.WriteLine("HMAC:");
                    ShowBytesInHex(hmacBytes);
                    ShowMenu(moves);

                    while (!(int.TryParse(Console.ReadLine(), out userMove) && userMove >= 0 && userMove <= moves.Count)) ;
                    if (userMove != 0)
                    {
                        Console.WriteLine($"Your move: {moves[userMove - 1]}");
                        Console.WriteLine($"Computer move: {moves[compMove]}");
                        Console.WriteLine(GameResult(userMove, compMove + 1, moves.Count));
                        Console.WriteLine("HMAC Key:");
                        ShowBytesInHex(key);
                    }
                }
                while (userMove != 0);
            }
            else ShowArgsExample();
        }

        private static bool CheckCommandLineArgs(List<string> args)
        {
            return !(args.Count % 2 == 0 || args.GroupBy(x => x).Any(g => g.Count() > 1));
        }

        private static void ShowBytesInHex(byte[] bytes)
        {
            foreach (byte elem in bytes)
            {
                Console.Write(string.Format("{0:X}", elem));
            }
            Console.WriteLine('\n');
        }

        private static void ShowMenu(List<string> moves)
        {
            for (int i = 0; i < moves.Count; i++)
            {
                Console.WriteLine($"{i + 1}) {moves[i]}");
            }
            Console.WriteLine("0) Exit\nEnter your move:");
        }

        private static void ShowArgsExample()
        {
            Console.WriteLine("You input even number of arguments or duplicate arguments.\nExaple of correct arguments:");
            Console.WriteLine("rock paper scissors lizard spok");
        }

        private static string GameResult(int userMove, int compMove, int movesCount)
        {
            if (userMove == compMove) return "Draw";

            bool isWin = true;
            for (int i = 1; i <= movesCount / 2; i++)
            {
                isWin &= (userMove + i) % movesCount != compMove % movesCount;
            }
            return isWin ? "You win!" : "You lose!";
        }
    }
}
