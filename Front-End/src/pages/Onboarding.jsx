import { useState } from 'react';
import FirstSection from '../components/layouts/Onboarding/FirstSection';
import SecondSection from '../components/layouts/Onboarding/SecondSection';

const Onboarding = () => {
  const [activeSection, setActiveSection] = useState('first');

  const handleStart = () => {
    setActiveSection('second');
  };

  return (
    <div className="onboarding">
      {activeSection === 'first' ? (
        <FirstSection onStart={handleStart} />
      ) : (
        <SecondSection />
      )}
    </div>
  );
};
export default Onboarding;
