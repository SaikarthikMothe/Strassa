import React from "react";
import { Route, Routes } from "react-router-dom";

import Start from "./pages/Start";
import UserLogin from "./pages/UserLogin";
import CaptainLogin from "./pages/CaptainLogin";
import UserSignup from "./pages/UserSignup";
import CaptainSignup from "./pages/CaptainSignup";
import Home from "./pages/Home";
import Riding from "./pages/Riding";
import UserProtectWrapper from "./pages/UserProtectWrapper";
import UserServiceSelection from "./pages/UserServiceSelection";
import UserLogout from "./pages/UserLogout";
import CaptainHome from "./pages/CaptainHome";
import CaptainProtectWrapper from "./pages/CaptainProtectWrapper";
import CaptainLogout from "./pages/CaptainLogout";
import CaptainRiding from "./pages/CaptainRiding";
import CaptainRideSummary from "./pages/CaptainRideSummary";
import UserRideHistory from "./components/UserRideHistory";
import CaptainRideHistory from "./components/CaptainRideHistory";
import CaptainEarnings from "./components/CaptainEarnings";
import FuelRequest from "./pages/FuelRequest";
import FuelAccepted from "./pages/FuelAccepted";
import FuelWaiting from "./pages/FuelWaiting";
import FuelPayment from "./pages/FuelPayment";
import FuelSuccess from "./pages/FuelSuccess";
import CaptainFuelDelivery from "./components/CaptainFuelDelivery";
import RepairIntroScreen from "./pages/RepairIntroScreen";
// import RepairCallScreen from "./pages/RepairCallScreen";
import RepairDetailsForm from "./components/RepairDetailsForm";
import RepairCallPanel from "./pages/RepairCallPanel";
import SearchingMechanic from "./components/SearchingMechanic";
import MechanicAssigned from "./components/MechanicAssigned";
import MechanicEnRoute from "./components/MechanicEnRoute";
import CaptainEnRoute from "./components/CaptainEnRoute";
import UserRepairApproval from "./components/UserRepairApproval";
import RepairInProgress from "./components/RepairInProgress";
import CaptainRepairOutcome from "./components/CaptainRepairOutcome";
import UserCompleted from "./components/UserCompleted";
import RepairNotFixable from "./components/RepairNotFixable";
import RepairPayment from "./components/RepairPayment";
import RateMechanic from "./components/RateMechanic";
import RepairTowingOffer from "./components/RepairTowingOffer";
import CaptainDiagnose from "./components/CaptainDiagnose";
import TowingIntro from "./pages/TowingIntro";
import TowingHome from "./components/TowingHome";
import TowingConfirm from "./components/TowingConfirm";
import TowingSearching from "./pages/TowingSearching";
import TowingTracking from "./components/TowingTracking";
import TowingPayment from "./components/TowingPayment";
import TowingCompletion from "./components/TowingCompletion";
import CaptainTowingRequest from "./components/CaptainTowingRequest";
import CaptainTowingEnroute from "./components/CaptainTowingEnroute";
import CaptainTowingProgress from "./components/CaptainTowingProgress";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Start />} />
      <Route path="/login" element={<UserLogin />} />
      <Route
        path="/service-selection"
        element={
          <UserProtectWrapper>
            <UserServiceSelection />
          </UserProtectWrapper>
        }
      />
      <Route path="/riding" element={<Riding />} />
      <Route path="/signup" element={<UserSignup />} />
      <Route path="/history" element={<UserRideHistory />} />
      <Route path="/captain/history" element={<CaptainRideHistory />} />
      <Route
        path="/home"
        element={
          <UserProtectWrapper>
            <Home />
          </UserProtectWrapper>
        }
      />
      <Route
        path="/user/logout"
        element={
          <UserProtectWrapper>
            <UserLogout />
          </UserProtectWrapper>
        }
      />
      {/* Captain routes */}
      <Route path="/captain-login" element={<CaptainLogin />} />
      <Route path="/captain-signup" element={<CaptainSignup />} />
      <Route path="/captain-riding" element={<CaptainRiding />} />
      <Route
        path="/captain-home"
        element={
          <CaptainProtectWrapper>
            <CaptainHome />
          </CaptainProtectWrapper>
        }
      />
      <Route
        path="/captain/deliver/:fuelRequestId"
        element={<CaptainFuelDelivery />}
      />
      <Route
        path="/captain/ride-summary/:rideId"
        element={
          <CaptainProtectWrapper>
            <CaptainRideSummary />
          </CaptainProtectWrapper>
        }
      />
      <Route path="/captain/earnings" element={<CaptainEarnings />} />
      <Route
        path="/captain/logout"
        element={
          <CaptainProtectWrapper>
            <CaptainLogout />
          </CaptainProtectWrapper>
        }
      />
      <Route
        path="/fuel"
        element={
          <UserProtectWrapper>
            <FuelRequest />
          </UserProtectWrapper>
        }
      />
      <Route path="/fuel/waiting/:fuelRequestId" element={<FuelWaiting />} />
      <Route path="/fuel/accepted/:fuelRequestId" element={<FuelAccepted />} />
      <Route path="/fuel/payment/:fuelRequestId" element={<FuelPayment />} />
      <Route path="/fuel/success" element={<FuelSuccess />} />
      {/*---------------------repair call------------------ */}
      <Route path="/repair" element={<RepairIntroScreen />} />
      <Route path="/repair/request" element={<RepairCallPanel />} />
      <Route path="/repair/details" element={<RepairDetailsForm />} />
      <Route
        path="/repair/searching/:repairRequestId"
        element={<SearchingMechanic />}
      />
      <Route
        path="/repair/assigned/:repairRequestId"
        element={<MechanicAssigned />}
      />
      <Route
        path="/repair/enroute/:repairRequestId"
        element={<MechanicEnRoute />}
      />
      <Route
        path="/captain/repair/enroute/:repairRequestId"
        element={<CaptainEnRoute />}
      />
      <Route
        path="/captain/repair/diagnose/:repairRequestId"
        element={<CaptainDiagnose />}
      />
      <Route
        path="/repair/approve/:repairRequestId"
        element={<UserRepairApproval />}
      />
      <Route
        path="/captain/repair/reject/:repairRequestId"
        element={<UserRepairApproval />}
      />
      <Route
        path="/repair/in-progress/:repairRequestId"
        element={<RepairInProgress />}
      />
      <Route
        path="captain/repair/outcome/:repairRequestId"
        element={<CaptainRepairOutcome />}
      />
      <Route
        path="/repair/completed/:repairRequestId"
        element={<UserCompleted />}
      />
      <Route
        path="/repair/rating/:repairRequestId"
        element={<RateMechanic />}
      />
      <Route
        path="/repair/not-fixable/:repairId"
        element={<RepairNotFixable />}
      />
      <Route path="/repair/payment/:repairId" element={<RepairPayment />} />
      <Route
        path="/repair/towing-offer/:repairId"
        element={<RepairTowingOffer />}
      />


      <Route path="/towing-intro" element={<TowingIntro />} />
      <Route path="/towing" element={<TowingHome />} />
      <Route path="/towing/confirm" element={<TowingConfirm />} />
      <Route path="/towing/searching/:id" element = {<TowingSearching/>} />
      <Route path="/towing/tracking/:id" element = {<TowingTracking/>} />
      <Route path="/towing/payment/:id" element = {<TowingPayment/>} />
      <Route path="/towing/completion/:id" element = {<TowingCompletion/>} />

      <Route path="/captain/towing/request" element = {<CaptainTowingRequest/>} />
      <Route path="/captain/towing/enroute/:id" element = {<CaptainTowingEnroute/>} />
      <Route path="/captain/towing/progress/:id" element = {<CaptainTowingProgress/>} />
    </Routes>
  );
};

export default App;
