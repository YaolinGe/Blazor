namespace BlazorApp
{
    public class TodoItem
    {
        public string? Title { get; set; }
        public bool IsDone { get; set; } = false;
        public string? Description { get; set; }
    }
}
