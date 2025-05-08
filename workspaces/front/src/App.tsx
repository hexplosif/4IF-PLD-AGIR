import { RecoilRoot } from 'recoil'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Register, Menu,
  CreateGame, JoinGame, Lobby,
  Game, Rules, ViewCards, GreenIt,
  Admin, CreateCard,
} from './js/pages';

import Test from './js/pages/test/test';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './CSS/App.css'
import { SocketManagerProvider } from '@components/websocket/SocketManagerProvider'
import RequireAuth from './components/auth/RequireAuth';
import SummaryPage from './js/pages/summary/summary';
import Credits from './js/pages/credits/credits';
import anime from 'animejs';
import { useEffect } from 'react';
import ViewQuestions from "@app/js/pages/viewQuestions/viewQuestions.tsx";
import CreateQuestion from "@app/js/pages/createQuestion/createQuestion.tsx";

function App() {
  useEffect(() => {
    anime.suspendWhenDocumentHidden = false; // TODO: not here, move to animation manager
  }, []);

  return (
    <RecoilRoot>
      <MantineProvider
      >
        <Notifications
          position="bottom-center"
          zIndex={1000000}
        />
      <SocketManagerProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route
              path="/menu"
              element={
                <RequireAuth>
                  <Menu />
                </RequireAuth>
              }
            />
            <Route
              path="/createGame"
              element={
                <RequireAuth>
                  <CreateGame />
                </RequireAuth>
              }
            />
            <Route
                path="/admin/viewQuestions"
                element={
                    <RequireAuth>
                        <ViewQuestions />
                    </RequireAuth>
                }
            />
            <Route
              path="/admin/question"
              element={
                <RequireAuth>
                  <CreateQuestion />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/question"
              element={
                <RequireAuth>
                  <CreateQuestion />
                </RequireAuth>
              }
            />
            <Route
              path="/joinGame"
              element={
                <RequireAuth>
                  <JoinGame />
                </RequireAuth>
              }
            />
            <Route
              path="/lobby/:lobbyId"
              element={
                <RequireAuth>
                  <Lobby />
                </RequireAuth>
              }
            />
            <Route
              path="/game"
              element={
                <RequireAuth>
                  <Game />
                </RequireAuth>
              }
            />

            <Route path="/game/report" element={
                <RequireAuth>
                  <SummaryPage />
                </RequireAuth>
              }
            />

            <Route path="/admin" element={
                <RequireAuth isAdminRequired={true}>
                  <Admin />
                </RequireAuth>
            }/>

            <Route path="/createCard" element={
                <RequireAuth isAdminRequired={true}>
                  <CreateCard />
                </RequireAuth>
            }/>

            <Route path="/" element={<Navigate to="/register" />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/viewCards" element={<ViewCards />} />
            <Route path="/greenIt" element={<GreenIt />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/test" element={<Test />} />
          </Routes>

        </BrowserRouter>
      </SocketManagerProvider>

      </MantineProvider>
    </RecoilRoot>
  )
}

export default App
