import * as React from "react";
import logo from "./logo.svg";
import "./App.css";

import { createTheme, NextUIProvider, Spacer } from "@nextui-org/react";
import { Navbar, Text } from "@nextui-org/react";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { Box } from "./blocks/Box";
import TournamentSelection from "./components/TournamentSelection";
import TournamentPage from "./components/TournamentPage";
import { getTournamentQuery } from "./api";
import { IconButton } from "./icons/IconButton";
import { FaHome } from "react-icons/fa";

function App() {
  const [tournamentId, setTournamentId] = React.useState(null);

  const { isLoading: isTournamentLoading, data: tournamentData } = useQuery(
    getTournamentQuery(tournamentId, { enabled: tournamentId !== null })
  );

  return (
    <Box css={{ maxW: "100%" }}>
      <Navbar isBordered variant="sticky">
        <Navbar.Brand>
          <IconButton onClick={() => setTournamentId(null)}>
            <FaHome size={20} />
          </IconButton>
          <Spacer x={1} />
          <Text b color="inherit">
            Salty Citadel
          </Text>
          <Spacer x={1} />
          {tournamentId && tournamentData && !isTournamentLoading && (
            <Text color="secondary">{tournamentData.config.name}</Text>
          )}
        </Navbar.Brand>
      </Navbar>
      <Box
        css={{
          px: "$12",
          mt: "$8",
          "@xsMax": { px: "$10" },
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {tournamentId === null ? (
          <TournamentSelection setTournamentId={setTournamentId} />
        ) : (
          <TournamentPage tournamentId={tournamentId} />
        )}
      </Box>
    </Box>
  );
}

export default App;
