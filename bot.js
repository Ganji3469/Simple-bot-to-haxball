var roomName = "bot";
var maxPlayers = 14;
var roomPublic = true;
const geo = [{	"code": "BR", "lat": -23.5, "lon": -48.4 }];

const room = HBInit({ roomName: roomName, maxPlayers: maxPlayers, public: roomPublic, geo: geo[0], noPlayer: true });

room.setCustomStadium(Big);
room.setScoreLimit(3);
room.setTimeLimit(3);
room.setTeamsLock(true);
room.setTeamColors(1, 680, 0xFC40808, [0xBD0000, 0xDB0000, 0xFF0000]);
room.setTeamColors(2, 660, 0x140385, [0x040078, 0x09048A, 0x211091]);

setInterval (() => {
	room.clearBans();
	room.sendAnnouncement("Os bans foram limpos", null, 0xFFFF00, "italic", 1)
}, 1800 * 1000);// 30 minutos

function updateAdmins() { 
	// Get all players
	var players = room.getPlayerList();
	if ( players.length == 0 ) return; // No players left, do nothing.
	if ( players.find((player) => player.admin) != null ) return; // There's an admin left so do nothing.
	room.setPlayerAdmin(players[0].id, true); // Give admin to the first non admin player in the list
}

room.onPlayerJoin = function (player) {
	updateAdmins();
  room.sendAnnouncement("Bem vindo " + player.name)
  room.sendAnnouncement("digite !help")
}

room.onPlayerChat = function (player, message) {
    if (message.startsWith("!help")) {
        room.sendAnnouncement("!afk, !bb", player.id, 0xFFFF00, "bold", 1)
    }
    if (message.startsWith("!fechar")) {
		room.setPassword("37293828472347");
		room.sendAnnouncement("A sala foi trancada pelo criador")
		return false;
	} else if (message.startsWith("!abrir")) {
		room.setPassword();
		room.sendAnnouncement("A sala foi aberta pelo criador")
		return false;
	} else if (message.startsWith("!rr") && player.admin) {
		room.stopGame();
		room.startGame();
		room.pauseGame();
    } else  if (message.startsWith("!bb")) {
		room.onkickPlayer(player.id, "bb", false);
	} else if (message.startsWith("!rr") && player.admin) {
		room.stopGame();
		room.startGame();
		room.pauseGame();
	} else if (message.startsWith("!afk")) {
		if (afks.includes(player.id)) {
			afks.splice(afks.indexOf(player.id), 1);
			room.sendAnnouncement(player.name + " voltou do afk", null)
		} else {
			room.sendAnnouncement(player.name + " ficou afk", null)
			if (player.team != 0) room.setPlayerTeam(player.id, 0);
			afks.push(player.id);
		}
		return false;
	}
}

room.onPlayerTeamChange = (changedPlayer, byPlayer) => {

	if (afks.includes(changedPlayer.id)) {
		room.setPlayerTeam(changedPlayer.id, 0);
		if (byPlayer) room.sendAnnouncement(changedPlayer.name + " está afk e não pode ser movido.", null);
	}
}

room.onPlayerLeave = function(Player) {
	updateAdmins();
}
