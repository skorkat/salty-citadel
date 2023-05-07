import * as React from "react";

import { Card, Text, Tooltip } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa";

import { Box } from "../blocks/Box";
import { IconButton } from "../icons/IconButton";
import Player from "./Player";

const TournamentPage = ({ tournament, players }) => {
  const [adding, setAdding] = React.useState(false);

  if (adding) {
    return (
      <Player tournament={tournament} onComplete={() => setAdding(false)} />
    );
  }

  return (
    <Box
      css={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: "1em",
      }}
    >
      <Text>
        Additional players required:{" "}
        {tournament.config.number_of_players - players.length}
      </Text>
      <Box
        css={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          gap: "2em",
          flexWrap: "wrap",
        }}
      >
        {players?.map((player) => (
          <Box>
            <Card
              variant="bordered"
              css={{
                width: "10em",
                height: "5em",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Card.Body>
                <Text>{player.name}</Text>
              </Card.Body>
            </Card>
          </Box>
        ))}
        <Box>
          <Card
            variant="bordered"
            css={{
              width: "10em",
              height: "5em",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            isPressable
            onPress={() => setAdding(true)}
          >
            <Card.Body>
              <Tooltip content="Add player" color="success">
                <IconButton>
                  <FaPlus size={20} fill="#00FF80" />
                </IconButton>
              </Tooltip>
            </Card.Body>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default TournamentPage;
