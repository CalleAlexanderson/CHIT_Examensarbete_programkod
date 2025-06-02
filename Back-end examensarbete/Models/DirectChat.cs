namespace Backend.Models;

public class DirectChat {
    public int Id {get; set;}
    public User? FirstUser {get; set;}
    public string? FirstUserId {get; set;}
    public User? SecondUser {get; set;}
    public string? SecondUserId {get; set;}

}
