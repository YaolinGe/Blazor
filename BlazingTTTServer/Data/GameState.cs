namespace BlazingTTTServer.Data
{
    public class GameState
    {
        public char[,] Board { get; set; } = { { ' ', ' ', ' ' }, { ' ', ' ', ' ' }, { ' ', ' ', ' ' } };
        public char Player { get; set; } = 'o';
        public bool IsGameOver { get; set; } = false;
        public char Winner { get; set; } = ' ';
        public bool IsDraw { get; set; } = false;
    }
}
