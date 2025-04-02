import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { i18next } from "./config/i18n.ts"
import { I18nextProvider } from 'react-i18next'
import { LoadingPage } from './js/pages/index.ts'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <Suspense fallback={<LoadingPage/>}>
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </Suspense>
    </I18nextProvider>
  </React.StrictMode>,
)
