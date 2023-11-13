namespace BlazingTTTServer.Data
{
    public class Strategy
    {
        public List<List<int[]>> WinningCombos = new()
    {
        //First row
        new List<int[]>() {new int[] { 0,0 }, new int[] { 0, 1 }, new int[] { 0, 2} },
        //Second row
        new List<int[]>() {new int[] { 1,0 }, new int[] { 1, 1 }, new int[] { 1, 2} },
        //Third row
        new List<int[]>() {new int[] { 2,0 }, new int[] { 2, 1 }, new int[] { 2, 2} },

        //First column
        new List<int[]>() {new int[] { 0,0 }, new int[] { 1, 0 }, new int[] { 2, 0} },
        //Second column
        new List<int[]>() {new int[] { 0,1 }, new int[] { 1, 1 }, new int[] { 2, 1} },
        //Third column
        new List<int[]>() {new int[] { 0,2 }, new int[] { 1, 2 }, new int[] { 2, 2} },

        //Backward diagonal
        new List<int[]>() {new int[] { 0,0 }, new int[] { 1, 1 }, new int[] { 2, 2} },
        //Forward diagonal
        new List<int[]>() {new int[] { 0,2 }, new int[] { 1, 1 }, new int[] { 2, 0} },
    };

    }
}
