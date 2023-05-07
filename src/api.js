export const BASE_URL = "https://skorkat-json-server.herokuapp.com"

export const listTournamentsQuery = (...args) => ({
  queryKey: ["tournaments"],
  queryFn: () =>
    fetch(`${BASE_URL}/tournaments`).then((res) => res.json()),
  ...args,
});

export const getTournamentQuery = (tournamentId, ...args) => ({
  queryKey: ["tournament", tournamentId],
  queryFn: () =>
    fetch(`${BASE_URL}/tournaments/${tournamentId}`).then((res) =>
      res.json()
    ),
  ...args,
});

export const listPlayersQuery = (...args) => ({
  queryKey: ["players"],
  queryFn: () =>
    fetch(`${BASE_URL}/players`).then((res) => res.json()),
  ...args,
});

export const listPlayersInTournamentQuery = (tournamentId, ...args) => {
  return {
    queryKey: ["playersInTournament", tournamentId],
    queryFn: () =>
      fetch(`${BASE_URL}/players/?tournamentId=${tournamentId}`).then((res) =>
        res.json()
      ),
    enabled: !!tournamentId,
    ...args,
  };
};
