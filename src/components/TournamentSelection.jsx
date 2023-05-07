import { Loading, Table, Row, Col, Tooltip, Text } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";

import { StyledBadge } from "../blocks/StyleBadge";
import { DeleteIcon } from "../icons/DeleteIcon";
import { IconButton } from "../icons/IconButton";

import { FaTrashAlt } from "react-icons/fa";
import { listPlayersQuery, listTournamentsQuery } from "../api";

const columns = [
  { name: "NAME", key: "name" },
  { name: "NUM PLAYERS", key: "num_players" },
  { name: "NUM ARMIES", key: "num_armies" },
  { name: "NUM ROUNDS", key: "num_rounds" },
  { name: "STATUS", key: "status" },
  { name: "ACTIONS", key: "actions" },
];

const TournamentSelection = ({ setTournamentId }) => {
  const {
    isLoading: tournamentsIsLoading,
    error: tournamentsError,
    data: tournamentsData,
  } = useQuery(listTournamentsQuery());
  const {
    isLoading: playersIsLoading,
    error: playersError,
    data: playersData,
  } = useQuery(listPlayersQuery({ enabled: !!tournamentsData }));

  if (tournamentsError || playersError) {
    return <div>ERROR!</div>;
  }
  if (tournamentsIsLoading || playersIsLoading) {
    return <Loading />;
  }

  const playersByTournament = (playersData || []).reduce((acc, curr) => {
    const tournamentId = curr.tournamentId.toString();
    if (acc[tournamentId] === undefined) {
      return {
        ...acc,
        [tournamentId]: [curr],
      };
    }
    return {
      ...acc,
      [tournamentId]: [...acc[tournamentId], curr],
    };
  }, {});

  const renderCell = (tournament, columnKey) => {
    console.log("tournament", tournament);
    console.log("playersByTournament", playersByTournament);
    const playersInTournament =
      playersByTournament[tournament.id.toString()] || [];
    console.log(tournament.id.toString());
    console.log(playersInTournament);
    switch (columnKey) {
      case "name":
        return <Text>{tournament.config.name}</Text>;
      case "num_players":
        return <Text>{tournament.config.number_of_players}</Text>;
      case "num_armies":
        return <Text>{tournament.config.armies.length}</Text>;
      case "num_rounds":
        return <Text>{tournament.config.rounds.length}</Text>;
      case "status":
        if (playersInTournament.length > tournament.config.number_of_players) {
          return <StyledBadge type="error">Too Many Players</StyledBadge>;
        }
        if (playersInTournament.length < tournament.config.number_of_players) {
          return <StyledBadge type="warning">Awaiting Players</StyledBadge>;
        }
        return <StyledBadge type="ready">Ready</StyledBadge>;
      case "actions":
        return (
          <Row justify="center" align="center">
            <Col css={{ d: "flex" }}>
              <Tooltip content="Delete tournament" color="error">
                <IconButton>
                  <FaTrashAlt size={20} fill="#FF0080" />
                </IconButton>
              </Tooltip>
            </Col>
          </Row>
        );
      default:
        return tournament[columnKey];
    }
  };

  return (
    <Table
      css={{ height: "auto", minWidth: "100%", width: "80vw" }}
      selectionMode="single"
      onSelectionChange={(keys) => {
        if (keys.size) {
          setTournamentId([...keys][0]);
        }
      }}
    >
      <Table.Header columns={columns}>
        {(column) => (
          <Table.Column
            key={column.key}
            hideHeader={column.key === "actions"}
            align={column.key === "actions" ? "center" : "start"}
          >
            {column.name}
          </Table.Column>
        )}
      </Table.Header>
      <Table.Body items={tournamentsData}>
        {(item) => (
          <Table.Row>
            {(columnKey) => (
              <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
            )}
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
};

export default TournamentSelection;
