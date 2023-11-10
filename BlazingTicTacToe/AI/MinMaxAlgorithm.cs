namespace BlazingTicTacToe.AI
{
    public class MinMaxAlgorithm
    {
        public class Turn
        {
            public int row, col;
        };

        private static readonly char Player = 'x';
        private static readonly char Opponent = 'o';
        private static readonly char EmptyCell = ' ';

        //Returns true if there are moves left
        static bool AreMoveLeft(char[,] board)
        {
            for (int i = 0; i < 3; i++)
            {
                for (int j = 0; j < 3; j++)
                {
                    if (board[i, j] == EmptyCell)
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        static int GetCurrentScore(char[,] board)
        {
            // Validate for Rows.
            for (int i = 0; i < 3; i++)
            {
                if (board[i, 0] == board[i, 1] && board[i, 1] == board[i, 2])
                {
                    if (board[i, 0] == Player)
                    {
                        return +10;
                    }
                    else if (board[i, 0] == Opponent)
                    {
                        return -10;
                    }
                }
            }

            // Validate for Columns.
            for (int j = 0; j < 3; j++)
            {
                if (board[0, j] == board[1, j] && board[1, j] == board[2, j])
                {
                    if (board[0, j] == Player)
                    {
                        return +10;
                    }

                    else if (board[0, j] == Opponent)
                    {
                        return -10;
                    }
                }
            }

            // Validate for Backward diagonal.
            if (board[0, 0] == board[1, 1] && board[1, 1] == board[2, 2])
            {
                if (board[0, 0] == Player)
                {
                    return +10;
                }
                else if (board[0, 0] == Opponent)
                {
                    return -10;
                }
            }
            // Validate for Forward diagonal.
            if (board[0, 2] == board[1, 1] && board[1, 1] == board[2, 0])
            {
                if (board[0, 2] == Player)
                {
                    return +10;
                }
                else if (board[0, 2] == Opponent)
                {
                    return -10;
                }
            }

            return 0;
        }


        static int ComputeMinMax(char[,] board, int depth, bool isMax)
        {
            int score = GetCurrentScore(board);

            // If Max has won the game
            if (score == 10) return score;

            // If Mini has won the game
            if (score == -10) return score;

            // If it is a tie
            if (AreMoveLeft(board) == false) return 0;

            // Max move
            if (isMax)
            {
                int bestValue = -1000;

                for (int i = 0; i < 3; i++)
                {
                    for (int j = 0; j < 3; j++)
                    {
                        if (board[i, j] == EmptyCell)
                        {
                            // Make the move
                            board[i, j] = Player;

                            // Call ComputeMinMax recursively to get max
                            bestValue = Math.Max(bestValue, ComputeMinMax(board, depth + 1, !isMax));

                            // Undo the move
                            board[i, j] = EmptyCell;
                        }
                    }
                }
                return bestValue;
            }
            else
            {
                int bestValue = 1000;

                for (int i = 0; i < 3; i++)
                {
                    for (int j = 0; j < 3; j++)
                    {
                        if (board[i, j] == EmptyCell)
                        {
                            // Make the move
                            board[i, j] = Opponent;

                            // Call ComputeMinMax recursively to get min
                            bestValue = Math.Min(bestValue, ComputeMinMax(board, depth + 1, !isMax));

                            // Undo the move
                            board[i, j] = EmptyCell;
                        }
                    }
                }
                return bestValue;
            }
        }

        // AI will select best possible move
        public static Turn GetNextBestMove(char[,] board)
        {
            int bestValue = -1000;
            Turn bestTurn = new()
            {
                row = -1,
                col = -1
            };

            // GetCurrentScore ComputeMinMax function And return the cell with best value.
            for (int i = 0; i < 3; i++)
            {
                for (int j = 0; j < 3; j++)
                {
                    if (board[i, j] == EmptyCell)
                    {
                        board[i, j] = Player;
                        int currentTurnValue = ComputeMinMax(board, 0, false);

                        // Undo the move
                        board[i, j] = EmptyCell;

                        if (currentTurnValue > bestValue)
                        {
                            bestTurn.row = i;
                            bestTurn.col = j;
                            bestValue = currentTurnValue;
                        }
                    }
                }
            }
            return bestTurn;
        }
    }
}