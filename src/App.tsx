/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EidCard from './components/EidCard';
import FormistiCard from './components/FormistiCard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EidCard />} />
        <Route path="/formisti" element={<FormistiCard />} />
      </Routes>
    </BrowserRouter>
  );
}
