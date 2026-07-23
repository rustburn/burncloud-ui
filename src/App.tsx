/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Overview } from '@/pages/Overview';
import { Playground } from '@/pages/Playground';
import { Routes } from '@/pages/Routes';
import { Models } from '@/pages/Models';
import { Providers } from '@/pages/Providers';
import { Logs } from '@/pages/Logs';
import { APIKeys } from '@/pages/APIKeys';
import { Customers } from '@/pages/Customers';
import { Evaluation } from '@/pages/Evaluation';
import { Guardrails } from '@/pages/Guardrails';
import { Billing } from '@/pages/Billing';
import { Team } from '@/pages/Team';
import { Settings } from '@/pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <RouterRoutes>
          <Route path="/" element={<Overview />} />
          <Route path="/home" element={<Home />} />
          <Route path="/landing" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/routes" element={<Routes />} />
          <Route path="/models" element={<Models />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/keys" element={<APIKeys />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/evaluation" element={<Evaluation />} />
          <Route path="/guardrails" element={<Guardrails />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/team" element={<Team />} />
          <Route path="/settings" element={<Settings />} />
        </RouterRoutes>
      </Layout>
    </BrowserRouter>
  );
}
