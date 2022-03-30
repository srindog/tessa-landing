import React, { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import validator from 'validator';

import { auth } from '../../../firebase';
import {
  signUpWithEmailAndPassword,
  signUpWithGoogle,
} from '../../../firebase/auth';
import { Background } from '../../background/Background';
import { Section } from '../../layout/Section';
import { LandingNavbar } from '../landing/LandingNavbar';

function SignUp() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [inputError, setInputError] = useState('');

  const isValidEmail = !email || validator.isEmail(email);

  const handleSignUp = () => {
    if (!name) {
      setInputError('Please enter your full name');
      return;
    }
    if (!email) {
      setInputError('Please enter an email');
      return;
    }
    if (!password) {
      setInputError('Please enter a password');
      return;
    }
    signUpWithEmailAndPassword(name, email, password).catch((e) =>
      setInputError(e.message)
    );
  };

  const handleGoogleSignUp = () => {
    signUpWithGoogle().catch((e) => setInputError(e.message));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <></>;
  if (user) router.replace('/onboarding/interests-survey');

  return (
    <div className="antialiased text-gray-900">
      <Background className="h-screen w-screen bg-pattern-randomized">
        <Section yPadding="py-6">
          <LandingNavbar />
        </Section>
        <Section yPadding="py-10">
          <div className="flex items-center justify-center">
            <div className="flex flex-col text-center p-30">
              <input
                type="text"
                className="p-5 text-base border rounded-lg border-gray-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
              />
              <input
                type="text"
                className="p-5 text-base mt-5 border rounded-lg border-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail Address"
              />
              {!isValidEmail && (
                <span className="text-red-500">
                  Please enter a valid email!
                </span>
              )}
              <input
                type="password"
                className={`p-5 text-base ${
                  !isValidEmail ? 'mt-1' : 'mt-5'
                } border rounded-lg border-gray-400`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              {inputError && <span className="text-red-500">{inputError}</span>}
              <button
                disabled={!isValidEmail}
                className={`disabled:bg-gray-500 p-3 text-lg mt-4 rounded-lg text-white bg-black disabled:bg-blue-300`}
                onClick={handleSignUp}
              >
                Register
              </button>
              <button
                className="p-3 text-lg mt-5 rounded-lg text-white bg-blue-600"
                onClick={handleGoogleSignUp}
              >
                Register with Google
              </button>

              <div className="text-lg mt-5">
                Already have an account?{' '}
                <Link href="/onboarding/sign-in">Login now</Link>.
              </div>
            </div>
          </div>
        </Section>
      </Background>
    </div>
  );
}

export default SignUp;