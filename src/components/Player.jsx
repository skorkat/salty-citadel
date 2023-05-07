import React from "react";
import {
  Button,
  Checkbox,
  Input,
  Loading,
  useInput,
  Grid,
  Spacer,
  Text,
  Tooltip,
} from "@nextui-org/react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { FaAngleRight } from "react-icons/fa";

import { BASE_URL } from "../api";
import { Box } from "../blocks/Box";

const Player = ({ tournament, onComplete }) => {
  const queryClient = useQueryClient();
  const { value, reset, bindings } = useInput("");
  const [selectedArmies, setSelectedArmies] = React.useState([]);

  const { isLoading, mutate } = useMutation({
    mutationFn: () => {
      return fetch(`${BASE_URL}/players`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tournamentId: tournament.id,
          name: value,
          army_preferences: selectedArmies,
        }),
      });
    },
    onError: () => onComplete(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      queryClient.invalidateQueries({
        queryKey: ["playersInTournament", tournament.id],
      });
      onComplete();
    },
  });

  const updateSelectedArmies = (army) => {
    const newSelectedArmies = [...selectedArmies];
    const index = selectedArmies.indexOf(army.id);
    if (index === -1) {
      newSelectedArmies.push(army.id);
    } else {
      newSelectedArmies.splice(index, 1);
    }
    setSelectedArmies(newSelectedArmies);
  };

  const armyIdToName = tournament.config.armies.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.id.toString()]: curr.name,
    }),
    {}
  );

  return (
    <Box>
      <Box css={{ display: "flex", justifyContent: "space-between" }}>
        <Input
          {...bindings}
          helperText="Please enter your name"
          label="Name"
          placeholder="Enter your name"
        />
        <Button
          disabled={!value || isLoading}
          ghost
          color="success"
          auto
          iconRight={<FaAngleRight />}
          onClick={() => mutate()}
        >
          {isLoading ? (
            <Loading type="points" color="currentColor" size="sm" />
          ) : (
            "Create"
          )}
        </Button>
      </Box>
      <Spacer y={2} />
      <Text size="$sm" i>
        Select the armies you might be interested in playing. You can select 0
        armies, all of the armies, or anywhere in between.
      </Text>
      <Spacer y={1} />
      <Text size="$sm" i>
        The order you select armies in will determing the your preference order.
        You can unselect and reselect armies to re-order your preferences.{" "}
      </Text>
      <Spacer y={1} />
      <Text size="$sm" i>
        The armies you are assigned in the tournament will be based on your
        preferences and the preferences of all other players. You may receive an
        army you have not selected if you select fewer than{" "}
        {tournament.config.rounds[0].armies_per_player} armies, or if other
        players choose the same preferences as you.
      </Text>
      <Spacer y={1} />
      <Box css={{ display: "flex", justifyContent: "space-around" }}>
        <Box css={{ display: "flex", flexDirection: "column" }}>
          <Text color="secondary" b>
            Selected armies:
          </Text>
          <Spacer y={1} />
          {tournament.config.armies.map((army) => (
            <Checkbox
              key={army.id}
              isSelected={selectedArmies.includes(army.id)}
              onChange={() => updateSelectedArmies(army)}
            >
              {army.name}
            </Checkbox>
          ))}
        </Box>
        <Box>
          <Text color="secondary" b>
            Selected armies (in order of preference):
          </Text>
          <Spacer y={1} />
          {selectedArmies.map((armyId, i) => (
            <Text size="$xl">{`${i + 1} - ${
              armyIdToName[armyId.toString()]
            }`}</Text>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Player;
