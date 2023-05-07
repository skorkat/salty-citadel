import { Loading } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";

import { listPlayersInTournamentQuery, getTournamentQuery } from "../api";
import PlayerSelection from "./PlayerSelection";
import GenerateArmies from "./GenerateArmies";

const TournamentPage = ({ tournamentId }) => {
  const {
    isLoading: tournamentIsLoading,
    error: tournamentError,
    data: tournamentData,
  } = useQuery(getTournamentQuery(tournamentId));
  const {
    isLoading: playerIsLoading,
    error: playerError,
    data: playerData,
  } = useQuery(listPlayersInTournamentQuery(tournamentId));

  if (tournamentError || playerError) {
    return <div>ERROR!</div>;
  }
  if (tournamentIsLoading || playerIsLoading) {
    return <Loading />;
  }

  if (playerData.length < tournamentData.config.number_of_players) {
    return (
      <PlayerSelection
        tournament={tournamentData}
        players={playerData}
      ></PlayerSelection>
    );
  }

  if (!tournamentData.playerArmies) {
    return (
      <GenerateArmies
        tournament={tournamentData}
        players={playerData}
      ></GenerateArmies>
    );
  }
};

export default TournamentPage;
