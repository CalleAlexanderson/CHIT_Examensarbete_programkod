using System.Collections.Concurrent;
using Backend.Models;

public class TempDb {
    private readonly ConcurrentDictionary<string, UserConnection> _connections = new();

    public ConcurrentDictionary<string, UserConnection> connections => _connections;
}