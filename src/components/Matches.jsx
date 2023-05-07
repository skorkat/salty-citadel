import { Card, Text } from "@nextui-org/react";

import { Box } from "../blocks/Box";

const Matches = ({ players, tournament }) => {
  const armyIdToName = tournament.config.armies.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.id]: curr.name,
    }),
    {}
  );

  return (
    <Box
      css={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: "1em",
      }}
    >
      <Box
        css={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          gap: "2em",
          flexWrap: "wrap",
        }}
      >
        {players.map((player) => (
          <Box>
            <Card
              variant="bordered"
              css={{
                width: "20em",
                height: "15 em",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Card.Body>
                <Text h3>{player.name}</Text>
                {tournament.playerArmies
                  .filter((p) => p.playerId.toString() === player.id.toString())
                  .map((playerArmy, idx) => (
                    <Text>
                      Match {idx + 1} - {armyIdToName[playerArmy.armyId]}
                    </Text>
                  ))}
              </Card.Body>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Matches;
