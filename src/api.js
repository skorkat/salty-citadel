export const listTournamentsQuery = (...args) => ({
  queryKey: ["tournaments"],
  queryFn: () =>
    fetch("http://localhost:3002/tournaments").then((res) => res.json()),
  ...args,
});

export const getTournamentQuery = (tournamentId, ...args) => ({
  queryKey: ["tournament", tournamentId],
  queryFn: () =>
    fetch(`http://localhost:3002/tournaments/${tournamentId}`).then((res) =>
      res.json()
    ),
  ...args,
});

export const listPlayersQuery = (...args) => ({
  queryKey: ["players"],
  queryFn: () =>
    fetch("http://localhost:3002/players").then((res) => res.json()),
  ...args,
});

export const listPlayersInTournamentQuery = (tournamentId, ...args) => {
  return {
    queryKey: ["playersInTournament", tournamentId],
    queryFn: () =>
      fetch(`http://localhost:3002/players/${tournamentId}`).then((res) =>
        res.json()
      ),
    enabled: !!tournamentId,
    ...args,
  };
};
