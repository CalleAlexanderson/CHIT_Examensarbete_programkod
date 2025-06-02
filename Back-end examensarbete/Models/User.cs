using System.ComponentModel.DataAnnotations;
using System.Reflection.Metadata;

namespace Backend.Models;

public class User {
    public int Id {get; set;}
    public string FriendId {get; set;} = "";

    public string Email {get; set;} = "";

    public string Username {get; set;} = "";

    public string Password {get; set;} = "";

    public string Avatar {get; set;} = "";

}

public class UpdateUser {
    public string NewUsername {get; set;} = "";

    public string Avatar {get; set;} = "";
}
