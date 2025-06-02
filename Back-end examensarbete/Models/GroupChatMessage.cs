namespace Backend.Models;

public class GroupChatMessage {
    public int Id {get; set;}
    
    public User? Sender {get; set;}
    public string? SenderId {get; set;}

    public GroupChat? GroupChat {get; set;}

    public int GroupChatId {get; set;}

    public DateTime DatePosted {get; set;}

    public string MessageContent {get; set;} = "";

}
