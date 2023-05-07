import * as React from "react";
import logo from "./logo.svg";
import "./App.css";

import { createTheme, NextUIProvider } from "@nextui-org/react";
import { Navbar, Text } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Box } from "./blocks/Box";
import TournamentSelection from "./components/TournamentSelection";
import TournamentPage from "./components/TournamentPage";

const darkTheme = createTheme({
  type: "dark",
});

const queryClient = new QueryClient();

function App() {
  const [tournamentId, setTournamentId] = React.useState(null);
  console.log("tournamentId", tournamentId);

  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider theme={darkTheme}>
        <Box css={{ maxW: "100%" }}>
          <Navbar isBordered variant="sticky">
            <Navbar.Brand>
              <Text b color="inherit" hideIn="xs">
                Salty Citadel
              </Text>
            </Navbar.Brand>
          </Navbar>
          <Box
            css={{
              px: "$12",
              mt: "$8",
              "@xsMax": { px: "$10" },
              marginLeft: "auto",
              marginRight: "auto",
              // width: "100%",
              // display: "flex",
              // justifyContent: "center",
            }}
          >
            {tournamentId === null ? (
              <TournamentSelection setTournamentId={setTournamentId} />
            ) : (
              <TournamentPage tournamentId={tournamentId} />
            )}
          </Box>
        </Box>
      </NextUIProvider>
    </QueryClientProvider>
  );
}

export default App;
