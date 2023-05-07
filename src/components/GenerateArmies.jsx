import * as React from "react";

import { Button, Card, Loading, Grid, Text, Tooltip } from "@nextui-org/react";

import { Box } from "../blocks/Box";

const GenerateArmies = ({ players, tournament }) => {
  const [isCalculating, setIsCalculating] = React.useState(false);

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
        onClick={() => setIsCalculating(true)}
      >
        {isCalculating ? (
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
