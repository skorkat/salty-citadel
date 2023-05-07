const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function generateArmies(players, tournament) {
  const playerIdToIdx = players.reduce(
    (acc, curr, currIdx) => ({
      ...acc,
      [curr.id]: currIdx,
    }),
    {}
  );
  const getArmyRankOfPlayer = (playerId, army) =>
    players[playerIdToIdx[playerId]].army_preferences.findIndex(
      (a) => a === army
    );
  const tournamentArmies = tournament.config.armies.map((a) => a.id);
  const armiesNeededPerPlayer = tournament.config.rounds[0].armies_per_player;
  const playersByArmyPreference = players.reduce((acc, curr) => {
    const newAcc = { ...acc };
    for (const preference of curr.army_preferences) {
      if (acc[preference]) {
        newAcc[preference].push(curr.id);
      } else {
        newAcc[preference] = [curr.id];
      }
    }
    return newAcc;
  }, {});

  // row for each preference with cell for each player
  // null if no preference of that level, otherwise army id
  const ranks = tournamentArmies.map((t) => players.map((p) => null));
  for (const [playerIdx, player] of players.entries()) {
    for (const [preferenceIdx, army] of player.army_preferences.entries()) {
      ranks[preferenceIdx][playerIdx] = army;
    }
  }

  const selectionsByPlayer = players.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.id]: [],
    }),
    {}
  );
  const assignedArmies = new Set();
  // record when a player loses an army to another player
  const playersWithPriority = new Set();

  for (const [rankIdx, rank] of ranks.entries()) {
    // sort the armies by highest preference
    const armiesToDistribute = [
      ...new Set(rank.filter((r) => r !== null)),
    ].sort((x, y) => {
      const xPreferences = playersByArmyPreference[x]
        .map((p) =>
          players[playerIdToIdx[p]].army_preferences.findIndex((a) => a === x)
        )
        .sort();
      const yPreferences = playersByArmyPreference[y]
        .map((p) =>
          players[playerIdToIdx[p]].army_preferences.findIndex((a) => a === y)
        )
        .sort();
      if (xPreferences[0] !== yPreferences[0]) {
        // If one of them has a higher preference, sort that first
        return xPreferences[0] - yPreferences[0];
      }
      const numXHighPreferences = xPreferences.filter(
        (k) => k === xPreferences[0]
      ).length;
      const numYHighPreferences = yPreferences.filter(
        (k) => k === yPreferences[0]
      ).length;
      if (numXHighPreferences !== numYHighPreferences) {
        // If one of them has more players who placed it at its highest preference, sort that first
        return numYHighPreferences - numXHighPreferences;
      }
      if (xPreferences.length !== yPreferences.length) {
        // If one of them has more players who preferenced it at any position, sort that first
        return yPreferences.length - xPreferences.length;
      }
      // Randomly order if they are otherwise indistinguishable
      return Math.random() > 0.5;
    });

    const newPlayersWithPriority = new Set();
    for (const army of armiesToDistribute) {
      // If this is the only player that selected this preference, then give it to them
      let playerToAssign = null;
      let playersToGivePriority = [];
      if (assignedArmies.has(army)) {
        // Already assigned this one, move on
      } else if (playersByArmyPreference[army].length === 1) {
        const player = playersByArmyPreference[army][0];
        // If we haven't already filled the player, add the army to them
        // Otherwise we do nothing and leave the army to be assigned to another player
        if (selectionsByPlayer[player].length < armiesNeededPerPlayer) {
          playerToAssign = player;
        }
      } else {
        const potentialPlayers = playersByArmyPreference[army].filter(
          (p) => selectionsByPlayer[p].length < armiesNeededPerPlayer
        );
        // Get all players that have priority and also would get this army if
        // they didn't lose any other armies (ie. the difference between the
        // current rank and the priority they selected for their army is less
        // than the number of armies remaining to assign them)
        const priorityPlayers = potentialPlayers.filter(
          (p) =>
            playersWithPriority.has(p) &&
            getArmyRankOfPlayer(p, army) - rankIdx <
              Math.min(armiesNeededPerPlayer - selectionsByPlayer[p].length, 2)
        );
        if (priorityPlayers.length === 1) {
          // If only one of the potential players has priority, give it to them
          playerToAssign = priorityPlayers[0];
        } else if (priorityPlayers.length > 1) {
          // Find all players that set this army at the current preference
          const playersWithPriorityAndPreference = priorityPlayers.filter(
            (p) => rank[playerIdToIdx[p]] === army
          );
          if (playersWithPriorityAndPreference.length === 1) {
            // If there's only one priority player with this as the highest preference,
            // then give it to them
            playerToAssign = playersWithPriorityAndPreference[0];
          } else if (playersWithPriorityAndPreference.length > 1) {
            // If there are multiple players, randomly choose one
            playerToAssign = getRandom(playersWithPriorityAndPreference);
          } else {
            // If none of the priority players have this as their current preference,
            // still give it to one of them because they are a priority
            // TODO: Filter these to the ones who set the highest non-current preference
            playerToAssign = getRandom(priorityPlayers);
          }
        } else {
          // Find all players that set this army at the current preference
          const playersWithPreference = potentialPlayers.filter(
            (p) => rank[playerIdToIdx[p]] === army
          );
          if (playersWithPreference.length === 1) {
            // If there's only one player with this as the highest preference,
            // then give it to them
            playerToAssign = playersWithPreference[0];
          } else if (playersWithPreference.length > 1) {
            // If there are multiple players, randomly choose one
            playerToAssign = getRandom(playersWithPreference);
          } else {
            // Randomly assign it to one of the players
            // TODO: This case should never be reached (because there will
            // always be at least one player who has set this as their
            // preference at this level)
            playerToAssign = getRandom(potentialPlayers);
          }
        }
        playersToGivePriority = potentialPlayers.filter(
          (p) => p !== playerToAssign
        );
      }

      // Make the assignment to the player
      if (playerToAssign) {
        selectionsByPlayer[playerToAssign].push(army);
        assignedArmies.add(army);
        playersWithPriority.delete(playerToAssign);
        // Add everyone that missed out to the priority list
        for (const player of playersToGivePriority) {
          newPlayersWithPriority.add(player);
        }
      }
    }

    // Update the players with priority after this round of assignment
    for (const player of newPlayersWithPriority) {
      playersWithPriority.add(player);
    }
  }

  let remainingArmies = tournamentArmies
    .filter((a) => !assignedArmies.has(a))
    // Randomize
    .sort((x, y) => Math.random() - 0.5)
    // Push supplementary armies to the back
    .sort((x, y) => {
      const armyX = tournament.config.armies.find((a) => a.id === x);
      const armyY = tournament.config.armies.find((a) => a.id === y);
      if (armyX.supplement === armyY.supplement) {
        return 0;
      }
      if (armyX.supplement) {
        return 1;
      }
      return -1;
    })
    // Pull preferences to the front
    .sort((x, y) => {
      const xHasPreferences = playersByArmyPreference[x];
      const yHasPreferences = playersByArmyPreference[y];
      if (xHasPreferences === undefined && yHasPreferences === undefined) {
        return 0;
      }
      if (xHasPreferences === undefined) {
        return 1;
      }
      if (yHasPreferences === undefined) {
        return -1;
      }
      return yHasPreferences.length - xHasPreferences.length;
    });

  // Fill the remaining empty cells
  for (const player of players) {
    if (selectionsByPlayer[player.id].length < armiesNeededPerPlayer) {
      for (const i of Array(
        armiesNeededPerPlayer - selectionsByPlayer[player.id].length
      ).fill()) {
        const newArmy = remainingArmies.splice(0, 1);
        selectionsByPlayer[player.id].push(newArmy[0]);
      }
    }
  }

  return selectionsByPlayer;
}
