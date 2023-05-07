import * as React from "react";

import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Button, Card, Loading, Grid, Text, Tooltip } from "@nextui-org/react";

import { Box } from "../blocks/Box";
import { generateArmies } from "../functions/generateArmies";

const GenerateArmies = ({ players, tournament }) => {
  const queryClient = useQueryClient();
  const [isCalculating, setIsCalculating] = React.useState(false);

  const { isLoading, mutate } = useMutation({
    mutationFn: (playerArmies) => {
      return fetch(`http://localhost:3002/tournaments/${tournament.id}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playerArmies }),
      });
    },
    onError: () => setIsCalculating(false),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      queryClient.invalidateQueries({
        queryKey: ["tournament", tournament.id],
      });
      setIsCalculating(false);
    },
  });

  return (
    <Box
      css={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: "1em",
      }}
    >
      <Text>All players joined!</Text>
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
      </Box>

      <Button
        disabled={isCalculating}
        ghost
        color="success"
        auto
        onClick={() => {
          setIsCalculating(true);
          const armiesByPlayer = generateArmies(players, tournament);
          const playerArmies = [];
          for (const [player, armies] of Object.entries(armiesByPlayer)) {
            for (const army of armies.sort((x, y) => Math.random() > 0.5)) {
              playerArmies.push({
                playerId: player,
                armyId: army,
              });
            }
          }
          mutate(playerArmies);
        }}
      >
        {isCalculating || isLoading ? (
          <>
            Generating Armies
            <Loading type="points" color="currentColor" size="sm" />
          </>
        ) : (
          "Generate Armies"
        )}
      </Button>
    </Box>
  );
};

export default GenerateArmies;
