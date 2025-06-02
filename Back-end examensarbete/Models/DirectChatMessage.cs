namespace Backend.Models;

public class DirectChatMessage {
    public int Id {get; set;}
    public User? Sender {get; set;}
    public int? SenderId {get; set;}
    public User? Receiver {get; set;}
    public int? ReceiverId {get; set;}
    public DateTime DatePosted {get; set;}
    public string MessageContent {get; set;} = "";

}
