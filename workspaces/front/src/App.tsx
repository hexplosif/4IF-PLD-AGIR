import { RecoilRoot } from 'recoil'
import React from 'react'
import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Register from './js/pages/register/register'
import Home from './js/pages/home/home'
import CreateGame from './js/pages/createGame/createGame'
import JoinGame from './js/pages/joinGame/joinGame'
import Lobby from './js/pages/lobby/lobby'
import Menu from './js/pages/menu/menu'
import Game from './js/pages/game/game'
import Rules from './js/pages/rules/rules'
import ViewCards from './js/pages/viewCards/viewCards'
import GreenIt from './js/pages/greenIt/greenIt'
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import PageTest from './js/pages/test/test'


import './CSS/App.css'
import { SocketManagerProvider } from '@components/websocket/SocketManagerProvider'
import Test from './components/game/test'
import RequireAuth from './components/auth/RequireAuth';
import SummaryPage from './js/pages/summary/summary';
import Credits from './js/pages/credits/credits';

function App() {

  return (
    <RecoilRoot>
      <MantineProvider
      >
        <Notifications
        position="bottom-center"
        zIndex={1000000}
        / >
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


            <Route path="/home" element={<Home />} />
            <Route path="/game/report" element={
                <RequireAuth>
                  <SummaryPage />
                </RequireAuth>
              }
            />
            <Route path="/" element={<Navigate to="/register" />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/viewCards" element={<ViewCards />} />
            <Route path="/greenIt" element={<GreenIt />} />
            <Route path="/credits" element={<Credits />} />
          </Routes>

        </BrowserRouter>
      </SocketManagerProvider>

      </MantineProvider>
    </RecoilRoot>
  )
}

export default App
